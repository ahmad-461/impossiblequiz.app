"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  unlockAchievement,
  addXP,
  Achievement,
  ACHIEVEMENTS,
} from "../../../lib/achievements";
import { sound } from "../../../lib/sound";

interface EscapeRoomResult {
  outcome: "escaped" | "trapped";
  roomsClearedCount: number;
  roomsFailedCount: number;
  timeRemaining: number;
  timeUsed: number;
  roomsStatus: ("cleared" | "failed" | "pending")[];
  evaluated?: boolean;
}

export default function EscapeRoomResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<EscapeRoomResult | null>(null);

  // Active toast triggers for newly unlocked achievements
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [currentToast, setCurrentToast] = useState<Achievement | null>(null);

  // Handle sequential toast queue
  useEffect(() => {
    if (toastQueue.length > 0 && !currentToast) {
      const next = toastQueue[0];
      setCurrentToast(next);
      setToastQueue((prev) => prev.slice(1));
      sound.playAchievement();
    }
  }, [toastQueue, currentToast]);

  useEffect(() => {
    if (currentToast) {
      const timer = setTimeout(() => {
        setCurrentToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentToast]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("escape_room_result");
      if (stored) {
        const parsed: EscapeRoomResult = JSON.parse(stored);
        setResult(parsed);

        // Evaluate achievements & XP only once per attempt
        if (!parsed.evaluated) {
          const isEscaped = parsed.outcome === "escaped";

          // Play ending sound effect cue
          if (isEscaped) {
            sound.playVictory();
          } else {
            sound.playLifeLost();
          }

          // Calculate Escape Room XP:
          // Escaped: 100 XP base, Trapped: 5 XP per cleared room
          const calculatedXp = isEscaped ? 100 : parsed.roomsClearedCount * 5;

          addXP(calculatedXp);

          const newlyUnlocked: Achievement[] = [];

          // 1. Escape Artist Achievement
          if (isEscaped) {
            if (unlockAchievement("escape_artist")) {
              const match = ACHIEVEMENTS.find((a) => a.id === "escape_artist");
              if (match) newlyUnlocked.push(match);
            }
          }

          if (newlyUnlocked.length > 0) {
            setToastQueue((prev) => [...prev, ...newlyUnlocked]);
          }

          // -------------------------------------------------------------
          // Save lifetime stats to local storage for the Profile Page
          // -------------------------------------------------------------
          try {
            const statsStr = localStorage.getItem("impossible_quiz_player_stats");
            const stats = statsStr ? JSON.parse(statsStr) : {
              totalQuizzesPlayed: 0,
              totalCorrectAnswers: 0,
              totalQuestionsAnswered: 0,
              aiTwinWins: 0,
              aiTwinLosses: 0,
              aiTwinTies: 0,
              categoryPlayCounts: {} as Record<string, number>,
            };

            // Register escape room played as general counts
            stats.totalQuizzesPlayed += 1;
            stats.totalCorrectAnswers += (parsed.roomsClearedCount || 0);
            stats.totalQuestionsAnswered += 8; // Escape room always has exactly 8 rooms

            stats.categoryPlayCounts["code_escape_room"] = (stats.categoryPlayCounts["code_escape_room"] || 0) + 1;

            localStorage.setItem("impossible_quiz_player_stats", JSON.stringify(stats));
          } catch (err) {
            console.error("Failed to update escape room stats in localStorage:", err);
          }

          // Save evaluation flag
          const updated = { ...parsed, evaluated: true };
          sessionStorage.setItem("escape_room_result", JSON.stringify(updated));
          setResult(updated);
        }
      } else {
        // Fallback or redirect if no session exists
        router.replace("/escape-room");
      }
    } catch (e) {
      console.error("Failed to parse escape room result from sessionStorage:", e);
      router.replace("/escape-room");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center font-mono text-xs text-textMuted">
        &gt; DECRYPTING SECURE SECTOR ESCAPE DATA...
      </div>
    );
  }

  const isEscaped = result.outcome === "escaped";

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm < 10 ? "0" + mm : mm}:${ss < 10 ? "0" + ss : ss}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto w-full select-none relative overflow-hidden animate-page-fade">
      {/* Immersive slow glowing drift atmospheric overlay */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drift-slow {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .atmospheric-escape-results {
          background: radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.04) 0%, rgba(10, 11, 16, 0) 70%),
                      radial-gradient(circle at 10% 80%, rgba(34, 211, 238, 0.04) 0%, rgba(10, 11, 16, 0) 70%);
          background-size: 200% 200%;
          animation: drift-slow 25s ease-in-out infinite;
        }
        .screenglow {
          box-shadow: inset 0 0 40px rgba(168, 85, 247, 0.05);
        }
        @keyframes achievement-unlock {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes badge-spin {
          0% { transform: rotate(-45deg) scale(0.6); }
          100% { transform: rotate(0) scale(1); }
        }
        .animate-achievement-unlock {
          animation: achievement-unlock 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-badge-spin {
          animation: badge-spin 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />

      <div className="absolute inset-0 atmospheric-escape-results pointer-events-none -z-10"></div>

      {/* Newly Unlocked Achievement Notification (Non-blocking sequential toast) */}
      {currentToast && (
        <div className="fixed bottom-6 right-6 z-50 border-2 border-neonCyan bg-bgDark shadow-[0_0_20px_rgba(34,211,238,0.4)] px-6 py-4 rounded-lg flex items-center gap-4 animate-achievement-unlock font-display overflow-hidden min-w-[280px]">
          {/* Neon Glow Sweep line */}
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-neonCyan to-neonViolet"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neonCyan/5 to-transparent pointer-events-none"></div>

          {/* Badge Icon Animating in with spin & glow */}
          <div className="text-3xl shrink-0 animate-badge-spin filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
            {currentToast.icon}
          </div>

          <div className="flex-1">
            <div className="text-[9px] font-black text-neonCyan uppercase tracking-[0.2em] animate-pulse">
              🏆 ACHIEVEMENT UNLOCKED!
            </div>
            <div className="text-xs text-textPrimary font-bold mt-0.5 uppercase tracking-wide">
              {currentToast.title}
            </div>
            <div className="text-[9px] text-textMuted mt-0.5 leading-normal">
              {currentToast.description}
            </div>
          </div>

          <button
            onClick={() => setCurrentToast(null)}
            className="text-[10px] text-textMuted hover:text-neonCyan ml-2 focus:outline-none cursor-pointer transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Outcome Badge */}
      <div
        style={{
          borderColor: isEscaped ? "#22d3ee" : "#ef4444",
          backgroundColor: isEscaped ? "rgba(34, 211, 238, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: isEscaped ? "#22d3ee" : "#ef4444",
          boxShadow: isEscaped ? "0 0 20px rgba(34, 211, 238, 0.3)" : "0 0 20px rgba(239, 68, 68, 0.3)",
        }}
        className={`mb-6 inline-flex items-center gap-2 border px-6 py-2.5 rounded-full text-xs md:text-sm font-black font-display tracking-widest uppercase transition-all duration-300 ${
          isEscaped ? "animate-bounce" : "animate-pulse"
        }`}
      >
        {isEscaped ? "🏆 INTRUSION SUCCESSFUL // ESCAPED 🏆" : "⚠️ LOCKOUT PERMANENT // TRAPPED ⚠️"}
      </div>

      <h1
        style={{
          color: isEscaped ? "#22d3ee" : "#f5f5f5",
          textShadow: isEscaped ? "0 0 10px rgba(34, 211, 238, 0.4)" : "0 0 10px rgba(239, 68, 68, 0.4)"
        }}
        className="text-4xl md:text-6xl font-black font-display tracking-tight mb-2 text-center uppercase"
      >
        {isEscaped ? "MAINFRAME ESCAPED" : "SYSTEM TRAPPED"}
      </h1>

      <p className="text-textMuted max-w-lg text-center text-sm md:text-base mb-10 leading-relaxed">
        {isEscaped
          ? "Excellent work! You successfully navigated the linear safety lock corridors, bypassed advanced algorithmic locks, and emerged clean from the corrupted core mainframe before lock expiration."
          : "Mission Failure. The overall countdown expired, or you triggered too many lockout errors (max 3 allowed), locking down the core security vaults forever. You remain trapped in the system core."}
      </p>

      {/* SECURE TERMINAL REPORT CARD */}
      <div className="w-full bg-bgDark border-2 border-neonViolet/30 rounded-lg p-6 md:p-8 relative overflow-hidden mb-8 shadow-[0_0_25px_rgba(168,85,247,0.1)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neonViolet/5 transform rotate-45 translate-x-12 -translate-y-12 border-b border-l border-neonViolet/10"></div>
        <div className="absolute bottom-2 right-4 text-[9px] font-mono text-neonViolet/25 tracking-widest uppercase font-display">
          SECURE TERMINAL // ESCAPE REPORT
        </div>

        {/* Header */}
        <div className="border-b border-neonViolet/15 pb-4 mb-6 flex justify-between items-center select-none font-display">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-textMuted uppercase">OPERATION LEVEL</span>
            <span className="text-xs md:text-sm font-bold text-neonCyan uppercase tracking-wider">CODE ESCAPE ROOM // ALPHA</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-[10px] tracking-widest text-textMuted uppercase">STATUS REPORT</span>
            <span
              style={{ color: isEscaped ? "#22d3ee" : "#ef4444" }}
              className="text-xs md:text-sm font-black uppercase"
            >
              {isEscaped ? "COMPLETED" : "FAILED // LOCKED"}
            </span>
          </div>
        </div>

        {/* Stats Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center select-none font-display mb-8">
          {/* Rooms Cleared */}
          <div className="p-4 rounded bg-[#0f111a] border border-neonViolet/10 shadow-[inset_0_0_8px_rgba(168,85,247,0.05)]">
            <span className="text-[10px] tracking-widest text-textMuted block uppercase mb-1">ROOMS CLEARED</span>
            <span
              style={{ color: isEscaped ? "#22d3ee" : "#f59e0b" }}
              className="text-2xl md:text-3xl font-black drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]"
            >
              {result.roomsClearedCount} / 8
            </span>
          </div>

          {/* Time Used */}
          <div className="p-4 rounded bg-[#0f111a] border border-neonViolet/10 shadow-[inset_0_0_8px_rgba(168,85,247,0.05)]">
            <span className="text-[10px] tracking-widest text-textMuted block uppercase mb-1">TIME CONSUMED</span>
            <span className="text-2xl md:text-3xl font-black text-neonViolet drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]">
              {formatTime(result.timeUsed)}
            </span>
          </div>

          {/* Time Remaining */}
          <div className="p-4 rounded bg-[#0f111a] border border-neonViolet/10 shadow-[inset_0_0_8px_rgba(168,85,247,0.05)]">
            <span className="text-[10px] tracking-widest text-textMuted block uppercase mb-1">TIME REMAINING</span>
            <span
              style={{ color: result.timeRemaining < 60 ? "#ef4444" : "#22d3ee" }}
              className="text-2xl md:text-3xl font-black drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]"
            >
              {formatTime(result.timeRemaining)}
            </span>
          </div>
        </div>

        {/* Detailed Room Progression Matrix */}
        <div className="border-t border-neonViolet/15 pt-6">
          <span className="text-[10px] font-display tracking-widest text-textMuted block uppercase mb-4 text-center sm:text-left">
            ROOM BY ROOM SECURITY ANALYSIS:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {result.roomsStatus.map((status, index) => {
              const rNum = index + 1;
              let borderCol = "rgba(168, 85, 247, 0.15)";
              let textCol = "#9ca3af";
              let label = "PENDING";
              let dotCol = "rgba(156, 163, 175, 0.3)";

              if (status === "cleared") {
                borderCol = "rgba(16, 185, 129, 0.3)";
                textCol = "#10b981";
                label = "CLEARED";
                dotCol = "#10b981";
              } else if (status === "failed") {
                borderCol = "rgba(239, 68, 68, 0.3)";
                textCol = "#ef4444";
                label = "FAILED";
                dotCol = "#ef4444";
              }

              return (
                <div
                  key={index}
                  style={{ borderColor: borderCol }}
                  className="flex flex-col p-3 rounded bg-bgDark/40 border text-left font-mono"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-textMuted">ROOM 0{rNum}</span>
                    <span style={{ backgroundColor: dotCol }} className="w-1.5 h-1.5 rounded-full animate-pulse"></span>
                  </div>
                  <span style={{ color: textCol }} className="text-xs font-bold tracking-wider">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buttons Action Group */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
        {/* Play Again */}
        <button
          onClick={() => router.push("/escape-room")}
          className="w-full sm:w-auto text-center px-10 py-4 text-sm font-black tracking-widest uppercase transition-all duration-300 rounded border-2 border-neonViolet text-textPrimary hover:bg-neonViolet/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] focus:outline-none focus:ring-2 focus:ring-neonViolet font-display"
        >
          RESET &amp; PLAY AGAIN
        </button>

        {/* Return to home */}
        <Link
          href="/"
          className="w-full sm:w-auto text-center px-10 py-4 text-sm font-black tracking-widest uppercase transition-all duration-300 rounded bg-neonCyan text-bgDark hover:bg-neonCyan/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] focus:outline-none focus:ring-2 focus:ring-neonCyan font-display"
        >
          RETURN TO HEADQUARTERS (HOME)
        </Link>
      </div>
    </div>
  );
}

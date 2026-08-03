"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { escapeRoomQuestions } from "../../lib/escapeRoomQuestions";

export default function EscapeRoomPage() {
  const router = useRouter();

  // Core States
  const [gameState, setGameState] = useState<"intro" | "playing" | "ended">("intro");
  const [currentRoomIdx, setCurrentRoomIdx] = useState<number>(0);
  const [roomAttempts, setRoomAttempts] = useState<number>(2); // 2 total attempts per room
  const [roomsStatus, setRoomsStatus] = useState<("cleared" | "failed" | "pending")[]>(
    Array(8).fill("pending")
  );

  // Selection Feedback States
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<"idle" | "correct" | "incorrect" | "lockout" | "trick">("idle");

  // Global Countdown Timer (300 seconds total)
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound/Vibe effects triggers
  const [isFlashingRed, setIsFlashingRed] = useState<boolean>(false);

  // Sync refs to avoid stale closure issues in the interval
  const roomsStatusRef = useRef(roomsStatus);
  const timeLeftRef = useRef(timeLeft);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    roomsStatusRef.current = roomsStatus;
  }, [roomsStatus]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Calculate failed/cleared count
  const failedCount = roomsStatus.filter((status) => status === "failed").length;

  const handleGameOver = useCallback((outcome: "escaped" | "trapped", finalTimeLeft: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setGameState("ended");

    const timeUsed = 300 - finalTimeLeft;
    const finalRoomsStatus = roomsStatusRef.current;

    const resultObj = {
      outcome,
      roomsClearedCount: finalRoomsStatus.filter((status) => status === "cleared").length,
      roomsFailedCount: finalRoomsStatus.filter((status) => status === "failed").length,
      timeRemaining: finalTimeLeft,
      timeUsed,
      roomsStatus: finalRoomsStatus,
    };

    try {
      sessionStorage.setItem("escape_room_result", JSON.stringify(resultObj));
    } catch (e) {
      console.error("Failed to save escape room result:", e);
    }

    router.push("/escape-room/results");
  }, [router]);

  // Handle countdown timer
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          // Out of time -> Trapped!
          handleGameOver("trapped", 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState, handleGameOver]);

  // Handle immediate failure condition (FR-21): > 3 failed rooms
  useEffect(() => {
    if (gameState === "playing" && failedCount > 3) {
      handleGameOver("trapped", timeLeft);
    }
  }, [failedCount, gameState, timeLeft, handleGameOver]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(300);
    setCurrentRoomIdx(0);
    setRoomAttempts(2);
    setRoomsStatus(Array(8).fill("pending"));
    setSelectedIdx(null);
    setFeedbackType("idle");
    setIsFlashingRed(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (gameState !== "playing" || feedbackType !== "idle") return;

    const currentQuestion = escapeRoomQuestions[currentRoomIdx];

    // Check for Trick Easter Egg Answer Option
    if (currentQuestion.options[idx] === "sudo poweroff") {
      setSelectedIdx(idx);
      setFeedbackType("trick");

      // Reset after 1.5 seconds so user can choose again, with absolutely no penalty to attempts, lives or time
      setTimeout(() => {
        setSelectedIdx(null);
        setFeedbackType("idle");
      }, 1500);
      return;
    }

    const isCorrect = idx === currentQuestion.correctAnswerIndex;

    setSelectedIdx(idx);

    if (isCorrect) {
      // Correct!
      setFeedbackType("correct");

      const newStatus = [...roomsStatus];
      newStatus[currentRoomIdx] = "cleared";
      setRoomsStatus(newStatus);

      // Transition to next room after a short delay
      setTimeout(() => {
        moveToNextRoom(newStatus, currentRoomIdx + 1);
      }, 1500);

    } else {
      // Incorrect guess
      const remainingAttempts = roomAttempts - 1;
      setRoomAttempts(remainingAttempts);

      // Trigger danger red flash animation
      setIsFlashingRed(true);
      setTimeout(() => setIsFlashingRed(false), 500);

      if (remainingAttempts <= 0) {
        // Run out of attempts for this room (FR-20)
        setFeedbackType("lockout");

        const newStatus = [...roomsStatus];
        newStatus[currentRoomIdx] = "failed";
        setRoomsStatus(newStatus);

        setTimeout(() => {
          moveToNextRoom(newStatus, currentRoomIdx + 1);
        }, 2000);
      } else {
        // Incorrect but can retry (FR-20)
        setFeedbackType("incorrect");

        // Clear feedback after a second to let them select again
        setTimeout(() => {
          setSelectedIdx(null);
          setFeedbackType("idle");
        }, 1200);
      }
    }
  };

  const moveToNextRoom = (currentStatus: ("cleared" | "failed" | "pending")[], nextIdx: number) => {
    // Check if we finished all rooms
    if (nextIdx >= 8) {
      const activeFailures = currentStatus.filter((status) => status === "failed").length;
      if (activeFailures <= 3) {
        handleGameOver("escaped", timeLeftRef.current);
      } else {
        handleGameOver("trapped", timeLeftRef.current);
      }
      return;
    }

    // Move forward
    setCurrentRoomIdx(nextIdx);
    setRoomAttempts(2);
    setSelectedIdx(null);
    setFeedbackType("idle");
  };

  const currentQuestion = escapeRoomQuestions[currentRoomIdx];

  // Formatting utility for time
  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm < 10 ? "0" + mm : mm}:${ss < 10 ? "0" + ss : ss}`;
  };

  // Render HTML / JSX
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 max-w-4xl mx-auto w-full select-none relative overflow-hidden">
      {/* Immersive slow glowing drift atmospheric overlay */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drift-slow {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .atmospheric-escape {
          background: radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.05) 0%, rgba(10, 11, 16, 0) 70%),
                      radial-gradient(circle at 90% 80%, rgba(34, 211, 238, 0.04) 0%, rgba(10, 11, 16, 0) 70%);
          background-size: 200% 200%;
          animation: drift-slow 30s ease-in-out infinite;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanlines::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 20;
          background-size: 100% 3px, 6px 100%;
          pointer-events: none;
        }
        .screenglow {
          box-shadow: inset 0 0 40px rgba(168, 85, 247, 0.05);
        }
      `}} />

      <div className="absolute inset-0 atmospheric-escape pointer-events-none -z-10"></div>

      {/* FLASH RED ALERT EFFECT */}
      {isFlashingRed && (
        <div className="absolute inset-0 bg-red-600/10 z-30 pointer-events-none transition-opacity duration-300"></div>
      )}

      {/* INTRO MODULE SCREEN */}
      {gameState === "intro" && (
        <div className="w-full bg-bgDark border-2 border-neonViolet/30 hover:border-neonCyan transition-all duration-300 rounded-lg p-6 md:p-10 relative screenglow shadow-[0_0_20px_rgba(168,85,247,0.08)] animate-page-fade">
          {/* Neon lock corner decor */}
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neonCyan"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neonCyan"></div>

          <div className="flex flex-col items-center text-center">
            {/* Pulsing Lock Icon */}
            <div className="w-16 h-16 rounded-full bg-neonViolet/10 border border-neonViolet/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse">
              <svg className="w-8 h-8 text-neonViolet" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <span className="text-[10px] font-display tracking-widest text-neonCyan bg-neonCyan/10 border border-neonCyan/25 px-3 py-1 rounded-full uppercase font-bold mb-4">
              CRITICAL // SECURE CORE SECTOR
            </span>

            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-textPrimary uppercase mb-6 leading-tight">
              CODE ESCAPE ROOM
            </h1>

            {/* Narrative Context Box */}
            <div className="w-full bg-bgDark/80 border border-neonViolet/15 rounded p-4 mb-8 text-left font-mono text-xs text-textMuted leading-relaxed max-w-2xl">
              <p className="mb-3 text-neonCyan">&gt; ACCESSING ENCRYPTED SECTOR PROFILES...</p>
              <p className="mb-3">&gt; WARNING: Host system corrupted by an aggressive memory leak loop. Standard safety boundaries have been overridden.</p>
              <p className="mb-3">&gt; MISSION DETAILS:</p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-textPrimary">
                <li>Traverse exactly <span className="text-neonCyan font-bold">8 linear firewalled rooms</span>.</li>
                <li>You have an overall countdown limit of <span className="text-neonViolet font-bold">5 minutes</span> (no per-question timers).</li>
                <li>Each room permits exactly <span className="text-neonCyan font-bold">2 lock attempts</span> (1 failure allowed).</li>
                <li>Failing both attempts automatically routes you to the next room, but marks it as <span style={{ color: "#ef4444" }}>failed</span>.</li>
                <li>If you fail <span style={{ color: "#ef4444" }} className="font-bold">more than 3 rooms</span>, you are permanently <span style={{ color: "#ef4444" }} className="font-bold">TRAPPED</span>.</li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-black font-display tracking-widest uppercase transition-all duration-300 rounded bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none focus:ring-2 focus:ring-neonCyan shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] border border-transparent hover:border-neonCyan"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neonViolet to-neonCyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></span>
              OVERRIDE CORE &amp; ENTER →
            </button>
          </div>
        </div>
      )}

      {/* GAMEPLAY MODULE SCREEN */}
      {gameState === "playing" && currentQuestion && (
        <div className="w-full flex flex-col gap-6 animate-page-fade">

          {/* Header Status Bar */}
          <div className="w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-neonViolet/20 pb-4">

            {/* Title & Progress */}
            <div className="flex flex-col text-center md:text-left font-display">
              <span className="text-[9px] tracking-widest text-textMuted uppercase font-bold">CORRUPTED SYSTEM ESCAPE</span>
              <span className="text-sm font-black text-neonCyan uppercase tracking-wider">
                ROOM_0{currentQuestion.roomNumber} {" // "} LEVEL_{currentQuestion.difficulty.toUpperCase()}
              </span>
            </div>

            {/* Room Locks Map */}
            <div className="flex items-center justify-center gap-2">
              {roomsStatus.map((status, index) => {
                const isActive = index === currentRoomIdx;
                let bgStyle = "bg-bgDark border-neonViolet/20 text-textMuted/40";
                let textVal: string | number = index + 1;

                if (isActive) {
                  bgStyle = "bg-neonCyan/10 border-neonCyan text-neonCyan shadow-[0_0_8px_rgba(34,211,238,0.3)] animate-pulse";
                } else if (status === "cleared") {
                  bgStyle = "bg-green-500/10 border-green-500 text-green-500";
                  textVal = "✓";
                } else if (status === "failed") {
                  bgStyle = "bg-red-500/10 border-red-500 text-red-500";
                  textVal = "✗";
                }

                return (
                  <div
                    key={index}
                    style={{ borderColor: status === "cleared" ? "#10b981" : status === "failed" ? "#ef4444" : undefined }}
                    className={`w-7 h-7 rounded border font-mono text-[10px] flex items-center justify-center font-bold transition-all duration-300 ${bgStyle}`}
                    title={`Room ${index + 1}: ${status.toUpperCase()}`}
                  >
                    {textVal}
                  </div>
                );
              })}
            </div>

            {/* Timer and Locks State */}
            <div className="flex items-center justify-between md:justify-end gap-6">

              {/* Room Attempt Indicators */}
              <div className="flex flex-col items-start md:items-end font-display">
                <span className="text-[9px] tracking-widest text-textMuted uppercase mb-1">LOCK ATTEMPTS</span>
                <div className="flex gap-1.5 items-center">
                  {Array.from({ length: 2 }).map((_, idx) => {
                    const attemptNumber = idx + 1;
                    const isActive = attemptNumber <= roomAttempts;
                    return (
                      <span
                        key={idx}
                        style={{ color: isActive ? "#22d3ee" : "#ef4444" }}
                        className={`text-xs transition-all duration-300 ${
                          isActive
                            ? "opacity-100 scale-100 filter drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]"
                            : "opacity-40 scale-90"
                        }`}
                      >
                        {isActive ? "🔓" : "🔒"}
                      </span>
                    );
                  })}
                  <span className="text-[10px] font-mono font-bold text-textMuted ml-1">
                    ({roomAttempts}/2)
                  </span>
                </div>
              </div>

              {/* Master Countdown Timer (MM:SS) */}
              <div className="flex items-center gap-2 font-display">
                <div className="text-right">
                  <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-0.5">TIME REMAINING</span>
                  <span
                    style={{ color: timeLeft < 60 ? "#ef4444" : "#22d3ee" }}
                    className={`text-base font-black tracking-widest transition-colors duration-300 ${
                      timeLeft < 60 ? "animate-pulse" : ""
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div
                  style={{ backgroundColor: timeLeft < 60 ? "#ef4444" : "#22d3ee" }}
                  className={`w-2.5 h-2.5 rounded-full ${timeLeft < 60 ? "animate-ping" : ""}`}
                ></div>
              </div>

            </div>
          </div>

          {/* Persistent global warning bar */}
          <div className="w-full h-1 bg-bgDark border border-neonViolet/15 rounded-full overflow-hidden">
            <div
              style={{
                width: `${(timeLeft / 300) * 100}%`,
                background: timeLeft < 60
                  ? "linear-gradient(to right, #ef4444, #f59e0b)"
                  : "linear-gradient(to right, #22d3ee, #a855f7)",
              }}
              className="h-full transition-all duration-1000"
            ></div>
          </div>

          {/* Dynamic Failure counter warn banner */}
          {failedCount > 0 && (
            <div
              style={{
                borderColor: failedCount === 3 ? "rgba(239, 68, 68, 0.4)" : "rgba(245, 158, 11, 0.3)",
                backgroundColor: failedCount === 3 ? "rgba(239, 68, 68, 0.05)" : "rgba(245, 158, 11, 0.03)",
                color: failedCount === 3 ? "#ef4444" : "#f59e0b",
              }}
              className="w-full py-2 px-4 rounded border text-center font-mono text-[10px] tracking-widest uppercase animate-pulse"
            >
              ⚠️ SECTOR INTEGRITY WARNING // DECRYPT FAILURE DETECTED: {failedCount}/3 PERMITTED ⚠️
            </div>
          )}

          {/* Narrative Line Frame */}
          <div className="w-full bg-[#12131e] border-l-4 border-neonCyan p-4 rounded-r shadow-[inset_0_0_10px_rgba(34,211,238,0.02)]">
            <div className="flex gap-2 items-start font-mono text-xs">
              <span className="text-neonCyan">&gt;</span>
              <p className="text-textMuted leading-relaxed italic">{currentQuestion.narrative}</p>
            </div>
          </div>

          {/* Room Question Interactive Panel */}
          <div className="w-full bg-bgDark border-2 border-neonViolet/30 rounded-lg p-6 md:p-8 relative screenglow shadow-[0_0_15px_rgba(168,85,247,0.06)]">
            {/* Corners overlay */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neonViolet/50"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neonViolet/50"></div>

            <span className="text-[10px] font-display tracking-widest text-textMuted font-bold uppercase block mb-4">
              [ CHALLENGE INTERFACE ]
            </span>

            <h2 className="text-base md:text-xl font-bold tracking-tight text-textPrimary leading-snug mb-8">
              {currentQuestion.questionText}
            </h2>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option: string, idx: number) => {
                const letters = ["A", "B", "C", "D", "E"];

                let borderStyle = { borderColor: "rgba(168, 85, 247, 0.2)" };
                let letterStyle = { borderColor: "rgba(168, 85, 247, 0.3)", backgroundColor: "rgba(168, 85, 247, 0.1)", color: "#a855f7" };
                let textStyle = { color: "#9ca3af" };

                if (selectedIdx !== null) {
                  const isCorrectAnswer = idx === currentQuestion.correctAnswerIndex;
                  const isSelectedAnswer = idx === selectedIdx;
                  const isTrickAnswer = currentQuestion.options[idx] === "sudo poweroff";

                  if (isCorrectAnswer) {
                    borderStyle = { borderColor: "#10b981" };
                    letterStyle = { borderColor: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981" };
                    textStyle = { color: "#10b981" };
                  } else if (isSelectedAnswer) {
                    if (isTrickAnswer) {
                      borderStyle = { borderColor: "#a855f7" };
                      letterStyle = { borderColor: "#a855f7", backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#a855f7" };
                      textStyle = { color: "#a855f7" };
                    } else {
                      // This was incorrect
                      borderStyle = { borderColor: "#ef4444" };
                      letterStyle = { borderColor: "#ef4444", backgroundColor: "rgba(239, 104, 104, 0.15)", color: "#ef4444" };
                      textStyle = { color: "#ef4444" };
                    }
                  } else {
                    borderStyle = { borderColor: "rgba(168, 85, 247, 0.05)" };
                    letterStyle = { borderColor: "rgba(168, 85, 247, 0.05)", backgroundColor: "transparent", color: "rgba(156, 163, 175, 0.3)" };
                    textStyle = { color: "rgba(156, 163, 175, 0.2)" };
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={selectedIdx !== null}
                    style={borderStyle}
                    className={`group option-btn w-full flex items-center p-4 rounded border text-left transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-neonCyan ${
                      selectedIdx === null
                        ? "hover:border-neonCyan hover:bg-neonCyan/5 cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    <span
                      style={letterStyle}
                      className="w-8 h-8 rounded flex items-center justify-center font-display font-bold mr-4 transition-all duration-200 border text-xs"
                    >
                      {letters[idx]}
                    </span>
                    <span
                      style={textStyle}
                      className="text-xs md:text-sm font-semibold transition-colors duration-200 flex-1"
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Feedbacks banners */}
          {feedbackType !== "idle" && (
            <div className="w-full animate-page-fade">
              {feedbackType === "correct" && (
                <div
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    borderColor: "#10b981",
                    color: "#10b981",
                  }}
                  className="w-full py-4 px-6 rounded border font-display text-center tracking-wider text-xs md:text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse uppercase"
                >
                  🚀 DOOR UNLOCKED // CORE OVERRIDE SUCCESSFUL // GOTO ROOM 0{currentRoomIdx + 2 <= 8 ? currentRoomIdx + 2 : 8} 🚀
                </div>
              )}

              {feedbackType === "trick" && (
                <div
                  style={{
                    backgroundColor: "rgba(168, 85, 247, 0.08)",
                    borderColor: "#a855f7",
                    color: "#a855f7",
                  }}
                  className="w-full py-4 px-6 rounded border font-display text-center tracking-wider text-xs md:text-sm shadow-[0_0_15px_rgba(168, 85, 247, 0.15)] animate-shake uppercase font-bold"
                >
                  💻 Nice try. Pick a real answer. 💻
                </div>
              )}

              {feedbackType === "incorrect" && (
                <div
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.08)",
                    borderColor: "#f59e0b",
                    color: "#f59e0b",
                  }}
                  className="w-full py-4 px-6 rounded border font-display text-center tracking-wider text-xs md:text-sm shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-shake uppercase"
                >
                  ⚡ LOCK ACCESS FAILED // CODES MISMATCHED // ATTEMPTS REMAINING: {roomAttempts} ⚡
                </div>
              )}

              {feedbackType === "lockout" && (
                <div
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    borderColor: "#ef4444",
                    color: "#ef4444",
                  }}
                  className="w-full py-4 px-6 rounded border font-display text-center tracking-wider text-xs md:text-sm shadow-[0_0_15px_rgba(239, 68, 68, 0.15)] animate-shake uppercase"
                >
                  🛡️ LOCKOUT WARNING: ATTEMPTS EXHAUSTED // SECTOR MARKED FAILED // FORWARD ROUTING... 🛡️
                </div>
              )}
            </div>
          )}

          {/* Quit / Back to safety */}
          <div className="w-full flex justify-between items-center mt-4">
            <Link
              href="/categories"
              className="text-xs font-display tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5"
            >
              ← ABORT SESSION (CATEGORIES)
            </Link>
          </div>

        </div>
      )}

      {/* Embedded Animations support */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 44%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}} />

    </div>
  );
}

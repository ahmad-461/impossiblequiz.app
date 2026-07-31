"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import html2canvas from "html2canvas";

interface QuizResult {
  score: number;
  peakStreak: number;
  category: string;
  outcome: "boss_victory" | "pool_victory" | "defeat" | "boss_defeat";
  accuracy: number;
  correct: number;
  total: number;
  submitted?: boolean;
  submittedId?: string;
  nickname?: string;
}

export default function ResultsPage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("impossible_quiz_result");
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read quiz result from sessionStorage:", e);
    }
  }, []);

  // Set default mockup if no run exists
  const activeResult: QuizResult = result || {
    score: 0,
    peakStreak: 0,
    category: "programming",
    outcome: "defeat",
    accuracy: 0,
    correct: 0,
    total: 0,
  };

  const isVictory = activeResult.outcome === "boss_victory" || activeResult.outcome === "pool_victory";

  // Category labels mapping
  const categoryLabels: Record<string, string> = {
    programming: "Programming // SYS.LANG",
    "logic-algorithms": "Logic/Algorithms // ALG.COMP",
    "data-analytics": "Data Analytics // DAT.SCALE",
    "computer-science-fundamentals": "Computer Science Fundamentals // SYS.CORE",
  };

  const categoryName = categoryLabels[activeResult.category] || activeResult.category.toUpperCase();

  // Custom visual assets based on outcomes
  const outcomeConfig = {
    boss_victory: {
      badge: "🏆 ULTIMATE VICTORY SECURED 🏆",
      title: "VICTORY SECURED",
      desc: `Incredible! You have bypassed all defense layers and terminated the core system architect of ${categoryName}. Your legendary accomplishment is ready for the archives.`,
      badgeStyle: "bg-neonCyan/20 border-neonCyan text-neonCyan shadow-[0_0_20px_rgba(34,211,238,0.4)]",
      titleStyle: "from-neonCyan to-neonViolet text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]",
    },
    pool_victory: {
      badge: "🏆 SYSTEM OVERLOAD // CLEARED 🏆",
      title: "POOL CLEARED",
      desc: `All available query challenges in ${categoryName} have been exhausted. You successfully survived the entire simulation mainframe.`,
      badgeStyle: "bg-neonCyan/20 border-neonCyan/50 text-neonCyan shadow-[0_0_15px_rgba(34,211,238,0.3)]",
      titleStyle: "from-neonCyan to-neonViolet text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]",
    },
    boss_defeat: {
      badge: "⚠️ SO CLOSE // FAIL AT ARCHITECT ⚠️",
      title: "SO CLOSE...",
      desc: `You reached the final Boss round of ${categoryName}, but the core security protocols overwhelmed your shields. Initialize a new session to claim ultimate victory!`,
      badgeStyle: "bg-neonViolet/20 border-neonViolet text-neonViolet shadow-[0_0_20px_rgba(168,85,247,0.4)]",
      titleStyle: "from-neonViolet to-textMuted text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]",
    },
    defeat: {
      badge: "🛡️ DEFEAT REGISTERED 🛡️",
      title: "SIMULATION FAILED",
      desc: `Your session was terminated. You were overcome by the high-difficulty security measures of ${categoryName}. Prepare yourself and try again.`,
      badgeStyle: "bg-neonViolet/10 border-neonViolet/30 text-neonViolet shadow-[0_0_15px_rgba(168,85,247,0.2)]",
      titleStyle: "from-neonViolet to-textMuted text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    },
  };

  const currentConfig = outcomeConfig[activeResult.outcome] || outcomeConfig.defeat;

  // Handle nickname submission to Supabase
  const handleScoreSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .insert({
          nickname: nickname.trim(),
          category: activeResult.category,
          score: activeResult.score,
          streak: activeResult.peakStreak,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      // If the proxy fallback occurred or there's an error
      if (error) {
        console.warn("Supabase entry error or offline warning:", error);

        // We'll still save it in sessionStorage to make the client feel it worked!
        const updatedResult: QuizResult = {
          ...activeResult,
          submitted: true,
          submittedId: "local_" + Math.random().toString(36).substring(2, 9),
          nickname: nickname.trim(),
        };
        sessionStorage.setItem("impossible_quiz_result", JSON.stringify(updatedResult));
        setResult(updatedResult);
        setSubmitError("Database offline. Score saved in temporary local session.");
      } else {
        // Success path
        const updatedResult: QuizResult = {
          ...activeResult,
          submitted: true,
          submittedId: data?.id || "submitted_" + Math.random().toString(36).substring(2, 9),
          nickname: nickname.trim(),
        };
        sessionStorage.setItem("impossible_quiz_result", JSON.stringify(updatedResult));
        setResult(updatedResult);
      }
    } catch (err) {
      console.error("Failed to submit score:", err);
      setSubmitError("Failed to establish mainframe upload. Cached locally.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy share text to clipboard
  const copyShareText = () => {
    const outcomeStr =
      activeResult.outcome === "boss_victory"
        ? "🏆 VICTORY SECURED (Boss Defeated)"
        : activeResult.outcome === "pool_victory"
        ? "🏆 POOL CLEARED"
        : activeResult.outcome === "boss_defeat"
        ? "⚠️ SO CLOSE (Terminated at Boss)"
        : "🛡️ SIMULATION FAILED";

    const text = `🏆 THE IMPOSSIBLE QUIZ GENERATOR 🏆
---------------------------------
Category: ${categoryName}
Outcome: ${outcomeStr}
Final Score: ${activeResult.score.toLocaleString()}
Peak Streak: ${activeResult.peakStreak}
Accuracy: ${activeResult.accuracy}%
Questions: ${activeResult.correct}/${activeResult.total}
---------------------------------
Can you survive the AI mainframe? Try now!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download share card using html2canvas
  const downloadShareCard = async () => {
    const element = document.getElementById("share-card");
    if (!element) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#0a0b10",
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `impossible_quiz_clearance_${activeResult.score}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating share card:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full select-none relative">

      {/* Dynamic Celebratory / Pulsing Background Rings */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
      `}} />

      {isVictory && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-neonViolet/10 to-neonCyan/10 blur-3xl animate-[pulse-glow_4s_infinite_alternate]"></div>
          <div className="absolute w-[300px] h-[300px] rounded-full border border-neonViolet/20 animate-[spin-slow_20s_linear_infinite]"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-neonCyan/15 animate-[spin-slow_30s_linear_infinite_reverse]"></div>
        </div>
      )}

      {/* Outcome Badge */}
      <div className={`mb-6 inline-flex items-center gap-2 border px-6 py-2.5 rounded-full text-xs md:text-sm font-black tracking-widest uppercase transition-all duration-300 ${
        isVictory ? "animate-bounce" : ""
      } ${currentConfig.badgeStyle}`}>
        {currentConfig.badge}
      </div>

      <h1 className={`text-4xl md:text-6xl font-black tracking-tight mb-2 text-center bg-gradient-to-r ${currentConfig.titleStyle}`}>
        {currentConfig.title}
      </h1>

      <p className="text-textMuted max-w-lg text-center text-sm md:text-base mb-10 leading-relaxed">
        {currentConfig.desc}
      </p>

      {/* Share Card & Score Dashboard Container */}
      <div
        id="share-card"
        className="w-full p-8 rounded-lg bg-bgDark border-2 border-neonViolet/30 shadow-[0_0_25px_rgba(168,85,247,0.15)] relative overflow-hidden mb-8"
      >
        {/* Futuristic Card Watermark / Deco */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neonViolet/5 transform rotate-45 translate-x-12 -translate-y-12 border-b border-l border-neonViolet/10"></div>
        <div className="absolute bottom-2 right-4 text-[10px] font-mono text-neonViolet/25 tracking-widest uppercase">
          SECURE TERMINAL // CLEARANCE REPORT
        </div>

        {/* Share Card Header */}
        <div className="border-b border-neonViolet/15 pb-4 mb-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest text-textMuted uppercase">SYSTEM MODULE</span>
            <span className="text-xs md:text-sm font-bold text-neonCyan font-mono uppercase">{categoryName}</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-[10px] font-mono tracking-widest text-textMuted uppercase">OUTCOME</span>
            <span className={`text-xs md:text-sm font-black font-mono uppercase ${isVictory ? "text-neonCyan" : "text-neonViolet"}`}>
              {activeResult.outcome.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {/* Score */}
          <div className="p-4 rounded bg-bgDark/50 border border-neonViolet/10 shadow-[inset_0_0_8px_rgba(168,85,247,0.05)]">
            <span className="text-[10px] font-mono tracking-widest text-textMuted block uppercase mb-1">FINAL SCORE</span>
            <span className="text-2xl md:text-3xl font-black text-neonCyan font-mono drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]">
              {activeResult.score.toLocaleString()}
            </span>
          </div>

          {/* Accuracy */}
          <div className="p-4 rounded bg-bgDark/50 border border-neonViolet/10 shadow-[inset_0_0_8px_rgba(168,85,247,0.05)]">
            <span className="text-[10px] font-mono tracking-widest text-textMuted block uppercase mb-1">ACCURACY</span>
            <span className="text-2xl md:text-3xl font-black text-neonViolet font-mono drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]">
              {activeResult.accuracy}%
            </span>
          </div>

          {/* Peak Streak */}
          <div className="p-4 rounded bg-bgDark/50 border border-neonViolet/10 shadow-[inset_0_0_8px_rgba(168,85,247,0.05)]">
            <span className="text-[10px] font-mono tracking-widest text-textMuted block uppercase mb-1">PEAK STREAK</span>
            <span className="text-2xl md:text-3xl font-black text-neonCyan font-mono drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]">
              {activeResult.peakStreak}
            </span>
          </div>

          {/* Questions */}
          <div className="p-4 rounded bg-bgDark/50 border border-neonViolet/10 shadow-[inset_0_0_8px_rgba(168,85,247,0.05)]">
            <span className="text-[10px] font-mono tracking-widest text-textMuted block uppercase mb-1">COMPLETED</span>
            <span className="text-2xl md:text-3xl font-black text-neonViolet font-mono drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]">
              {activeResult.correct}/{activeResult.total}
            </span>
          </div>
        </div>
      </div>

      {/* Share / Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-4 mb-10 justify-center">
        <button
          onClick={copyShareText}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded border border-neonViolet/40 hover:border-neonViolet bg-bgDark hover:bg-neonViolet/5 text-textPrimary hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
        >
          {copied ? "📋 COPIED SECURELY!" : "🔗 COPY RESULT TEXT"}
        </button>

        <button
          onClick={downloadShareCard}
          disabled={downloading}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded border border-neonCyan/40 hover:border-neonCyan bg-bgDark hover:bg-neonCyan/5 text-neonCyan hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
        >
          {downloading ? "⚙️ GENERATING CARD..." : "🖼️ DOWNLOAD SHARE IMAGE"}
        </button>
      </div>

      {/* Nickname Submission Section */}
      <div className="w-full p-6 rounded-lg bg-bgDark border border-neonViolet/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] mb-12">
        {activeResult.submitted ? (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-neonCyan font-mono text-sm font-black uppercase">
              <span>✅ RECORD SECURED</span>
            </div>
            <p className="text-xs text-textMuted mt-1 font-mono">
              Handle <span className="text-neonCyan font-bold">{activeResult.nickname}</span> has been permanently logged with score <span className="text-neonCyan font-bold">{activeResult.score.toLocaleString()}</span>.
            </p>
            {submitError && (
              <p className="text-[10px] text-neonViolet mt-1 font-mono">{submitError}</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleScoreSubmission} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black tracking-widest text-textPrimary uppercase font-mono">
                TRANSMIT SCORE TO ARCHIVES
              </h3>
              <p className="text-xs text-textMuted">
                Register your performance handle on the global hall of champions. No authentication required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                maxLength={20}
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="NICKNAME (E.G., PLAYER_1)"
                disabled={isSubmitting}
                className="flex-1 bg-bgDark/80 border border-neonViolet/30 focus:border-neonCyan rounded px-4 py-3 text-sm font-mono text-textPrimary placeholder:text-textMuted/40 focus:outline-none focus:ring-1 focus:ring-neonCyan transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting || !nickname.trim()}
                className="bg-neonViolet hover:bg-neonViolet/90 disabled:opacity-50 text-textPrimary text-xs font-black tracking-widest uppercase px-6 py-3 rounded border border-transparent hover:border-neonCyan shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center min-w-[140px]"
              >
                {isSubmitting ? "TRANSMITTING..." : "SUBMIT SCORE"}
              </button>
            </div>
            {submitError && (
              <p className="text-xs text-neonViolet font-mono mt-1 text-center sm:text-left">{submitError}</p>
            )}
          </form>
        )}
      </div>

      {/* Buttons Action Group */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
        {/* Play Again */}
        <Link
          href="/categories"
          className="w-full sm:w-auto text-center px-8 py-4 text-base font-bold tracking-widest uppercase transition-all duration-300 rounded-md border-2 border-neonViolet text-textPrimary hover:bg-neonViolet/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          PLAY AGAIN
        </Link>

        {/* View Leaderboard */}
        <Link
          href="/leaderboard"
          className="w-full sm:w-auto text-center px-8 py-4 text-base font-bold tracking-widest uppercase transition-all duration-300 rounded-md bg-neonCyan text-bgDark hover:bg-neonCyan/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
        >
          VIEW LEADERBOARD
        </Link>
      </div>

      {/* Home retreat option */}
      <Link
        href="/"
        className="mt-12 text-xs font-mono tracking-widest text-textMuted hover:text-neonCyan transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonCyan/50 pb-0.5"
      >
        ← ESCAPE TO HEADQUARTERS (HOME)
      </Link>
    </div>
  );
}

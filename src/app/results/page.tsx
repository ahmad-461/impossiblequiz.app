"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface QuizResult {
  score: number;
  peakStreak: number;
  category: string;
  outcome: "boss_victory" | "pool_victory" | "defeat";
  accuracy: number;
  correct: number;
  total: number;
}

export default function ResultsPage() {
  const [result, setResult] = useState<QuizResult | null>(null);

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

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full select-none">
      {/* Victory or Defeat Badge */}
      <div className={`mb-6 inline-flex items-center gap-2 border px-6 py-2 rounded-full text-sm font-black tracking-widest uppercase animate-bounce ${
        isVictory
          ? "bg-neonCyan/10 border-neonCyan/30 text-neonCyan shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          : "bg-neonViolet/10 border-neonViolet/30 text-neonViolet shadow-[0_0_15px_rgba(168,85,247,0.2)]"
      }`}>
        {isVictory ? "🏆 SIMULATION COMPLETED 🏆" : "🛡️ SYSTEM DEFEAT 🛡️"}
      </div>

      <h1 className={`text-4xl md:text-6xl font-black tracking-tight mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] ${
        isVictory ? "from-neonCyan to-neonViolet" : "from-neonViolet to-neonMuted"
      }`} style={{ backgroundImage: isVictory ? "linear-gradient(to right, #22d3ee, #a855f7)" : "linear-gradient(to right, #a855f7, #9ca3af)" }}>
        {isVictory
          ? activeResult.outcome === "boss_victory"
            ? "BOSS DEFEATED"
            : "POOL CLEARED"
          : "SIMULATION FAILED"}
      </h1>

      <p className="text-textMuted max-w-lg text-center text-sm md:text-base mb-12">
        {isVictory
          ? `Exceptional capability demonstrated. You survived the intense trial of ${categoryName}. Your results have been integrated.`
          : `Virtual mainframe has terminated your session. You were overcome by the high-difficulty security measures of ${categoryName}.`}
      </p>

      {/* Score Dashboard Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-12 p-8 rounded-lg bg-bgDark border-2 border-neonViolet/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] relative overflow-hidden">
        {/* Absolute diagonal stripe indicator */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neonViolet/5 transform rotate-45 translate-x-12 -translate-y-12"></div>

        {/* Score metric */}
        <div className="text-center p-4 border-b md:border-b-0 md:border-r border-neonViolet/10">
          <span className="text-xs font-mono tracking-widest text-textMuted block uppercase mb-1">FINAL SCORE</span>
          <span className="text-3xl md:text-4xl font-black text-neonCyan font-mono drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            {activeResult.score.toLocaleString()}
          </span>
        </div>

        {/* Accuracy metric */}
        <div className="text-center p-4 border-b md:border-b-0 md:border-r border-neonViolet/10">
          <span className="text-xs font-mono tracking-widest text-textMuted block uppercase mb-1">ACCURACY</span>
          <span className="text-3xl md:text-4xl font-black text-neonViolet font-mono drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
            {activeResult.accuracy}%
          </span>
        </div>

        {/* Peak Streak metric */}
        <div className="text-center p-4 border-b md:border-b-0 md:border-r border-neonViolet/10">
          <span className="text-xs font-mono tracking-widest text-textMuted block uppercase mb-1">PEAK STREAK</span>
          <span className="text-3xl md:text-4xl font-black text-neonCyan font-mono drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            {activeResult.peakStreak}
          </span>
        </div>

        {/* Total Correct metric */}
        <div className="text-center p-4">
          <span className="text-xs font-mono tracking-widest text-textMuted block uppercase mb-1">QUESTIONS</span>
          <span className="text-3xl md:text-4xl font-black text-neonViolet font-mono drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
            {activeResult.correct}/{activeResult.total}
          </span>
        </div>
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

"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";

export default function Home() {
  // Live Preview Interactive State
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const featuredQuestion = {
    questionText: "In Python, what is the output of [x for x in range(5) if x % 2 == 0]?",
    options: ["[1, 3]", "[0, 2, 4]", "[2, 4]", "[0, 1, 2, 3, 4]"],
    correctAnswerIndex: 1,
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedIdx !== null) return; // Prevent clicking during active feedback

    setSelectedIdx(idx);
    const correct = idx === featuredQuestion.correctAnswerIndex;
    setIsCorrect(correct);

    // Reset after 1.5 seconds so users can try again
    setTimeout(() => {
      setSelectedIdx(null);
      setIsCorrect(null);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center select-none relative overflow-hidden min-h-screen">
      {/* Retrained atmospheric layer: subtle slow-moving gradient glow */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drift-glow {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .atmospheric-bg {
          background: radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.08) 0%, rgba(10, 11, 16, 0) 60%),
                      radial-gradient(circle at 80% 75%, rgba(34, 211, 238, 0.06) 0%, rgba(10, 11, 16, 0) 60%);
          background-size: 200% 200%;
          animation: drift-glow 25s ease-in-out infinite;
        }
      `}} />

      <div className="absolute inset-0 atmospheric-bg pointer-events-none -z-10"></div>

      {/* 1. HERO SECTION & LIVE PREVIEW GRID */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            {/* Hero Badge */}
            <ScrollReveal className="mb-6 inline-flex items-center gap-2 bg-neonViolet/10 border border-neonViolet/30 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold font-display tracking-widest text-neonViolet uppercase">
              ⚡ LIVE DEMO CORE // ACCESSIBLE ⚡
            </ScrollReveal>

            {/* Main Title */}
            <ScrollReveal className="mb-6">
              <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-tight">
                TEST YOUR LIMITS IN THE{" "}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_15px_rgba(34,211,238,0.35)]">
                  IMPOSSIBLE QUIZ
                </span>
              </h1>
            </ScrollReveal>

            {/* Subtext */}
            <ScrollReveal className="mb-8">
              <p className="text-textMuted max-w-xl text-sm md:text-base leading-relaxed">
                An ultra-hard, competitive-style knowledge trial designed for top developers and engineers. Powered by an adaptive difficulty engine and dynamic real-time AI question synthesis. Do you have what it takes to survive the Boss Round?
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Primary CTA with intense glow response */}
              <Link
                href="/categories"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-black font-display tracking-widest uppercase transition-all duration-300 rounded bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none focus:ring-2 focus:ring-neonCyan shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] border border-transparent hover:border-neonCyan overflow-hidden text-center"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neonViolet to-neonCyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></span>
                START THE QUIZ
              </Link>

              {/* Escape Room Hardcore CTA */}
              <Link
                href="/escape-room"
                style={{ borderColor: "rgba(239, 68, 68, 0.45)", color: "#ef4444" }}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-black font-display tracking-widest uppercase transition-all duration-300 rounded border hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 text-center shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                ESCAPE ROOM 🔒
              </Link>

              {/* Secondary lower-emphasis link */}
              <Link
                href="/leaderboard"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-black font-display tracking-widest uppercase transition-all duration-300 rounded border border-neonCyan/25 hover:border-neonCyan bg-bgDark hover:bg-neonCyan/5 text-neonCyan focus:outline-none focus:ring-2 focus:ring-neonCyan text-center"
              >
                VIEW LEADERBOARD
              </Link>
            </ScrollReveal>

            {/* Futuristic status items */}
            <ScrollReveal className="mt-12 grid grid-cols-3 gap-8 max-w-lg border-t border-neonViolet/10 pt-8 w-full">
              <div>
                <div className="text-xl md:text-2xl font-black text-neonCyan font-display">04</div>
                <div className="text-[9px] uppercase tracking-widest text-textMuted mt-1 font-semibold">Sectors Available</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-neonViolet font-display">100%</div>
                <div className="text-[9px] uppercase tracking-widest text-textMuted mt-1 font-semibold">Difficulty Vector</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-neonCyan font-display">LIVE</div>
                <div className="text-[9px] uppercase tracking-widest text-textMuted mt-1 font-semibold">Leaderboards</div>
              </div>
            </ScrollReveal>
          </div>

          {/* Hero Right: Live Interactive Quiz Preview */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <ScrollReveal>
              {/* Actual code-rendered interactive quiz card */}
              <div className="w-full bg-bgDark border-2 border-neonViolet/30 hover:border-neonCyan transition-all duration-300 rounded-lg p-6 md:p-8 relative shadow-[0_0_20px_rgba(168,85,247,0.08)] group">
                {/* Glow corners decoration */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neonCyan"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neonCyan"></div>

                {/* Card Header Info */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] font-display tracking-widest px-2.5 py-1 rounded uppercase border text-neonCyan bg-neonCyan/10 border-neonCyan/25 font-bold">
                    DIFFICULTY: medium
                  </span>
                  <span className="text-[9px] font-display tracking-widest text-textMuted font-bold uppercase flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-neonCyan"></span>
                    LIVE PLAYABLE PREVIEW
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-sm md:text-base font-bold tracking-tight text-textPrimary leading-snug mb-6">
                  {featuredQuestion.questionText}
                </h3>

                {/* Options List */}
                <div className="flex flex-col gap-3">
                  {featuredQuestion.options.map((option, idx) => {
                    const letters = ["A", "B", "C", "D"];
                    const isSelected = selectedIdx === idx;
                    const isCorrectAnswer = idx === featuredQuestion.correctAnswerIndex;

                    // Compute styles using exact Hex values
                    let borderStyle = { borderColor: "rgba(168, 85, 247, 0.2)" };
                    let letterStyle = { borderColor: "rgba(168, 85, 247, 0.3)", backgroundColor: "rgba(168, 85, 247, 0.1)", color: "#a855f7" };
                    let textStyle = { color: "#9ca3af" };

                    if (selectedIdx !== null) {
                      if (isCorrectAnswer) {
                        borderStyle = { borderColor: "#10b981" };
                        letterStyle = { borderColor: "#10b981", backgroundColor: "#10b981", color: "#0a0b10" };
                        textStyle = { color: "#10b981" };
                      } else if (isSelected) {
                        borderStyle = { borderColor: "#ef4444" };
                        letterStyle = { borderColor: "#ef4444", backgroundColor: "#ef4444", color: "#f5f5f5" };
                        textStyle = { color: "#ef4444" };
                      } else {
                        borderStyle = { borderColor: "rgba(168, 85, 247, 0.05)" };
                        letterStyle = { borderColor: "rgba(168, 85, 247, 0.05)", backgroundColor: "transparent", color: "#9ca3af" };
                        textStyle = { color: "rgba(156, 163, 175, 0.3)" };
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={selectedIdx !== null}
                        style={borderStyle}
                        className={`w-full flex items-center p-3 rounded border text-left transition-all duration-200 focus:outline-none ${
                          selectedIdx === null ? "hover:border-neonCyan hover:bg-neonCyan/5 cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <span
                          style={letterStyle}
                          className="w-7 h-7 rounded flex items-center justify-center font-display font-bold mr-3 transition-all duration-200 border text-xs"
                        >
                          {letters[idx]}
                        </span>
                        <span
                          style={textStyle}
                          className="text-xs font-semibold transition-colors duration-200 flex-1"
                        >
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Demonstration Feedback Banner */}
                {selectedIdx !== null && (
                  <div
                    style={{
                      backgroundColor: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      borderColor: isCorrect ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
                      color: isCorrect ? "#10b981" : "#ef4444",
                    }}
                    className="mt-4 p-2.5 rounded border text-[10px] font-display text-center tracking-wider animate-pulse uppercase"
                  >
                    {isCorrect ? "🚀 Core Override Successful!" : "🛡️ Core Security Tripped!"}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>

      {/* 2. HOW IT WORKS / SYSTEM ARCHITECTURE */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-neonViolet/15">
        <ScrollReveal>
          <h2 className="text-xs font-black font-display tracking-widest text-neonCyan uppercase mb-12 text-center">
            SYSTEM_ARCHITECTURE // MAIN_FEATURES
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <ScrollReveal>
            <div className="p-6 rounded-lg bg-bgDark border border-neonViolet/20 shadow-[0_0_12px_rgba(168,85,247,0.01)] hover:border-neonCyan hover:shadow-[0_0_18px_rgba(34,211,238,0.1)] transition-all duration-300 relative group h-full">
              <div className="absolute top-0 left-0 w-1 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>
              <div className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-3">
                01 // DYNAMIC GENERATION
              </div>
              <h3 className="text-base font-bold font-display text-textPrimary uppercase mb-2">Real-Time Synthesis</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                Every trivia challenge is forged in real time by the Gemini core mainframe — ensuring no two sessions are ever identical.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature 2 */}
          <ScrollReveal>
            <div className="p-6 rounded-lg bg-bgDark border border-neonViolet/20 shadow-[0_0_12px_rgba(168,85,247,0.01)] hover:border-neonCyan hover:shadow-[0_0_18px_rgba(34,211,238,0.1)] transition-all duration-300 relative group h-full">
              <div className="absolute top-0 left-0 w-1 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>
              <div className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-3">
                02 // ADAPTIVE ENGINE
              </div>
              <h3 className="text-base font-bold font-display text-textPrimary uppercase mb-2">Dynamic Difficulty</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                Our lightweight Python serverless engine computes your trajectory after every answer to adapt challenges to your caliber.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature 3 */}
          <ScrollReveal>
            <div className="p-6 rounded-lg bg-bgDark border border-neonViolet/20 shadow-[0_0_12px_rgba(168,85,247,0.01)] hover:border-neonCyan hover:shadow-[0_0_18px_rgba(34,211,238,0.1)] transition-all duration-300 relative group h-full">
              <div className="absolute top-0 left-0 w-1 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>
              <div className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-3">
                03 // CORE BOSS ROUND
              </div>
              <h3 className="text-base font-bold font-display text-textPrimary uppercase mb-2">Hall of Champions</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                Survive 3 consecutive Hard problems to activate the ultimate Boss Security layer. Clear it to etch your handle on our leaderboard.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 2.5 FEATURED HARDCORE ESCAPE ROOM BANNER */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-neonViolet/15">
        <ScrollReveal>
          <div
            style={{ borderColor: "rgba(239, 68, 68, 0.25)" }}
            className="w-full p-8 rounded-lg bg-bgDark border-2 hover:border-red-500 transition-all duration-300 relative overflow-hidden shadow-[0_0_25px_rgba(239,68,68,0.05)] text-left flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 transform rotate-45 translate-x-12 -translate-y-12 border-b border-l border-red-500/10"></div>

            <div className="flex-1">
              <span
                style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444" }}
                className="inline-flex items-center gap-1.5 border px-3 py-1 rounded-full text-[10px] font-bold font-display tracking-widest uppercase mb-4 animate-pulse"
              >
                🚨 NEW HARDCORE MODE: ESCAPE ROOM 🚨
              </span>

              <h2 className="text-2xl md:text-3xl font-black font-display text-textPrimary uppercase mb-3 tracking-tight">
                CORRUPTED SYSTEM ESCAPE
              </h2>

              <p className="text-xs md:text-sm text-textMuted max-w-xl leading-relaxed">
                A narrative-driven, 8-room linear sequence of curated programming challenges. Race against a global 5-minute timer, managing a strict lock override system (max 3 room failures allowed). Can you hack your way out before the system wipes your stack?
              </p>
            </div>

            <div className="flex shrink-0 w-full md:w-auto">
              <Link
                href="/escape-room"
                style={{ borderColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                className="group w-full md:w-auto relative inline-flex items-center justify-center px-8 py-4 text-xs font-black font-display tracking-widest uppercase transition-all duration-300 rounded border hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239, 68, 68, 0.4)] text-center"
              >
                INITIATE ESCAPE MODE →
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* 3. CLOSING CTA SECTION */}
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 mb-12 border-t border-neonViolet/15">
        <ScrollReveal>
          <div className="w-full p-8 md:p-12 rounded-lg bg-gradient-to-r from-bgDark to-[#12131e] border border-neonViolet/30 relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.05)] text-center flex flex-col items-center">
            {/* Ambient subtle glow light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-neonViolet/5 blur-3xl pointer-events-none"></div>

            <h3 className="text-xl md:text-3xl font-black font-display tracking-tight text-textPrimary uppercase mb-4 relative z-10">
              Ready to test your limits?
            </h3>

            <p className="text-xs md:text-sm text-textMuted max-w-lg mb-8 relative z-10 leading-relaxed">
              Step into the simulation mainframe, master high-stakes adaptive difficulty trivia, and secure your place among elite programmers.
            </p>

            <Link
              href="/categories"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-xs font-black font-display tracking-widest uppercase transition-all duration-300 rounded bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none focus:ring-2 focus:ring-neonCyan shadow-[0_0_12px_rgba(168,85,247,0.4)] hover:shadow-[0_0_22px_rgba(34,211,238,0.6)] border border-transparent hover:border-neonCyan relative z-10"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neonViolet to-neonCyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></span>
              START THE QUIZ
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

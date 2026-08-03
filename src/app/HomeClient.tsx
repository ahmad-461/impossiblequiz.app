"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";
import { categories } from "../lib/categories";
import { staticQuestions } from "../lib/questions";
import { supabase } from "../../lib/supabase";

function DodgingButton({ onCatch }: { onCatch: () => void }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mobileTapped, setMobileTapped] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - buttonCenterX;
      const dy = e.clientY - buttonCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Trigger dodge if mouse is within 120px
      if (distance < 120) {
        // Calculate dodge direction: away from cursor
        const angle = Math.atan2(dy, dx);

        let newX = 0;
        let newY = 0;
        let attempts = 0;

        // Keep generating new offsets until we find one that is at least 180px away from the current cursor position
        while (attempts < 15) {
          const rx = (Math.random() - 0.5) * 300; // -150 to 150
          const ry = (Math.random() - 0.5) * 200; // -100 to 100

          const potentialAbsoluteX = buttonCenterX - position.x + rx;
          const potentialAbsoluteY = buttonCenterY - position.y + ry;
          const distToCursor = Math.sqrt(
            Math.pow(e.clientX - potentialAbsoluteX, 2) +
            Math.pow(e.clientY - potentialAbsoluteY, 2)
          );

          if (distToCursor > 180) {
            newX = rx;
            newY = ry;
            break;
          }
          attempts++;
        }

        if (attempts >= 15) {
          newX = position.x - Math.cos(angle) * 120;
          newY = position.y - Math.sin(angle) * 120;
        }

        const maxOffset = 250;
        newX = Math.max(-maxOffset, Math.min(maxOffset, newX));
        newY = Math.max(-120, Math.min(120, newY));

        setPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [position]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!mobileTapped) {
      e.preventDefault(); // Prevents click simulation
      const rx = (Math.random() - 0.5) * 240;
      const ry = (Math.random() - 0.5) * 140;
      setPosition({ x: rx, y: ry });
      setMobileTapped(true);
    } else {
      onCatch();
      setPosition({ x: 0, y: 0 });
      setMobileTapped(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.clientX !== 0 && e.clientY !== 0 && !mobileTapped) {
      onCatch();
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <button
      ref={buttonRef}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderColor: "#a855f7",
        color: "#f5f5f5",
      }}
      className="px-4 py-2 border rounded font-display text-[11px] tracking-widest uppercase hover:bg-neonViolet/20 hover:shadow-[0_0_12px_rgba(168, 85, 247, 0.3)] select-none cursor-pointer"
    >
      Don&apos;t Click This
    </button>
  );
}

export default function Home() {
  // Live Preview Interactive State
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [featuredQuestion, setFeaturedQuestion] = useState<{
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    difficulty: string;
  }>({
    questionText: "In Python, what is the output of [x for x in range(5) if x % 2 == 0]?",
    options: ["[1, 3]", "[0, 2, 4]", "[2, 4]", "[0, 1, 2, 3, 4]"],
    correctAnswerIndex: 1,
    difficulty: "medium",
  });
  const [contendersCount, setContendersCount] = useState<string>("150+");

  // Recent submissions feed state
  interface RecentSubmission {
    nickname: string;
    category: string;
    score: number;
    streak: number;
  }
  const [recentFeeds, setRecentFeeds] = useState<RecentSubmission[]>([]);

  // Easter Egg States
  const [showBreachToast, setShowBreachToast] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const glitchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatFeedCategory = (id: string): string => {
    if (id.startsWith("programming_")) {
      const parts = id.split("_");
      return `Programming: ${parts[1]?.toUpperCase() || "CORE"} (${parts[2]?.toUpperCase() || "EASY"})`;
    }
    if (id.startsWith("business_")) {
      const parts = id.split("_");
      return `Business: ${parts[1]?.toUpperCase() || "STRATEGY"} (${parts[2]?.toUpperCase() || "EASY"})`;
    }
    if (id.startsWith("english_")) {
      const parts = id.split("_");
      return `English: ${parts[1]?.toUpperCase() || "VOCAB"} (${parts[2]?.toUpperCase() || "EASY"})`;
    }
    const mapping: Record<string, string> = {
      "logic-algorithms": "Logic/Algo",
      "data-analytics": "Data Analytics",
      "computer-science-fundamentals": "CS Fundamentals"
    };
    return mapping[id] || id.replace("-", " ").toUpperCase();
  };

  useEffect(() => {
    // Print styled Console Easter Egg once on mount
    console.log(
      `%c\n  ___                             _ _     _      _____             _ \n |_ _|_ __  _ __   ___  ___  ___ (_) |__ | | ___|  _  \\ _   _ _ __ | |\n  | || '_ \\| '_ \\ / _ \\/ __|/ __|| | '_ \\| |/ _ \\ | |  | | | | '_ \\| |\n  | || |_) | |_) | (_) \\__ \\__ \\| | |_) | |  __/ |_|  | |_| | |_) |_|\n |___| .__/| .__/ \\___/|___/___/|_|_.__/|_|\\___|_____/ \\__,_| .__/(_)\n     |_|   |_|                                              |_|      \n\n%cLooking for bugs? So am I. — Ahmad & Jules\n`,
      "color: #a855f7; font-weight: bold; font-family: monospace; text-shadow: 0 0 5px rgba(168, 85, 247, 0.5); font-size: 11px;",
      "color: #22d3ee; font-weight: bold; font-family: monospace; font-size: 12px; padding-top: 10px;"
    );

    // Select a random question from staticQuestions to avoid hydration mismatches
    if (staticQuestions && staticQuestions.length > 0) {
      const randIdx = Math.floor(Math.random() * staticQuestions.length);
      const q = staticQuestions[randIdx];
      setFeaturedQuestion({
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        difficulty: q.difficulty,
      });
    }

    async function fetchContenders() {
      try {
        const { count, error } = await supabase
          .from("leaderboard")
          .select("*", { count: "exact", head: true });

        if (!error && count !== null && count !== undefined) {
          setContendersCount(String(count));
        } else {
          setContendersCount("150+");
        }
      } catch (e) {
        console.warn("Failed to fetch leaderboard count:", e);
        setContendersCount("150+");
      }
    }

    async function fetchRecentSubmissions() {
      try {
        const { data, error } = await supabase
          .from("leaderboard")
          .select("nickname, category, score, streak")
          .order("created_at", { ascending: false })
          .limit(3);

        if (!error && data) {
          setRecentFeeds(data as RecentSubmission[]);
        }
      } catch (e) {
        console.warn("Failed to fetch recent submissions for activity feed:", e);
      }
    }

    fetchContenders();
    fetchRecentSubmissions();

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, []);

  const triggerCatch = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setShowBreachToast(true);
    toastTimerRef.current = setTimeout(() => {
      setShowBreachToast(false);
    }, 4000);
  };

  const triggerGlitch = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    glitchTimerRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, 1500);
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
        @keyframes trick-card-pulse {
          0%, 100% {
            border-color: rgba(168, 85, 247, 0.3);
            box-shadow: 0 0 8px rgba(168, 85, 247, 0.1);
          }
          50% {
            border-color: rgba(168, 85, 247, 0.7);
            box-shadow: 0 0 16px rgba(168, 85, 247, 0.25);
          }
        }
        .trick-card-pulse {
          animation: trick-card-pulse 3s infinite ease-in-out;
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

              {/* Trick Glitch Button */}
              <button
                onClick={triggerGlitch}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-black font-display tracking-widest uppercase transition-all duration-300 rounded border border-neonViolet/25 hover:border-neonViolet bg-bgDark hover:bg-neonViolet/5 text-neonViolet focus:outline-none focus:ring-2 focus:ring-neonViolet text-center cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                ???
              </button>
            </ScrollReveal>

            {/* Futuristic status items */}
            <ScrollReveal className="mt-12 grid grid-cols-3 gap-8 max-w-lg border-t border-neonViolet/10 pt-8 w-full">
              <div>
                <div className="text-xl md:text-2xl font-black text-neonCyan font-display">
                  {String(categories.length).padStart(2, "0")}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-textMuted mt-1 font-semibold">Sectors Available</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-neonViolet font-display">
                  {contendersCount}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-textMuted mt-1 font-semibold">Leaderboard Contenders</div>
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
                    DIFFICULTY: {featuredQuestion.difficulty || "medium"}
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

      {/* 2. REAL-TIME ACTIVITY DISCOGNITIVES & HOW IT WORKS */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-neonViolet/15">
        {/* Dynamic Experience Activity Signal */}
        {recentFeeds && recentFeeds.length > 0 && (
          <ScrollReveal className="mb-12">
            <div className="w-full p-4 rounded bg-bgDark/80 border border-neonCyan/30 font-mono text-[11px] text-textMuted tracking-wider shadow-[0_0_12px_rgba(34,211,238,0.05)]">
              <div className="flex items-center gap-2 text-neonCyan font-bold uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-neonCyan animate-ping"></span>
                <span>SYSTEM DIAGNOSTIC: RECENT INFILTRATIONS (LIVE FEED)</span>
              </div>
              <div className="space-y-1.5 divide-y divide-neonViolet/10">
                {recentFeeds.map((feed, idx) => (
                  <div key={idx} className="pt-1.5 flex flex-col sm:flex-row justify-between gap-2 text-[10px] md:text-xs">
                    <div>
                      <span className="text-neonCyan font-bold">&gt; USER &quot;{feed.nickname}&quot;</span>
                      <span className="text-textPrimary"> bypassed sector </span>
                      <span className="text-neonViolet font-bold">{formatFeedCategory(feed.category)}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span>SCORE: </span>
                      <span className="text-neonCyan font-bold">{feed.score.toLocaleString()} PTS</span>
                      <span className="text-textPrimary"> {" // "} STREAK: </span>
                      <span className="text-neonViolet font-bold">{feed.streak} 🔥</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 2. HOW IT WORKS / SYSTEM ARCHITECTURE */}
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

      {/* Decoy Button Container */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 flex justify-end relative">
        <div className="border border-dashed border-neonViolet/30 bg-bgDark/60 p-4 rounded-lg relative max-w-[320px] w-full shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:border-neonViolet/60 transition-all duration-300 ease-in-out trick-card-pulse select-none overflow-visible">
          {/* Card Label */}
          <div className="absolute -top-3 left-4 bg-bgDark px-2 text-[10px] font-display font-bold tracking-widest text-neonViolet border border-neonViolet/30 rounded uppercase select-none">
            [TRICK_CORE_V1.0]
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-mono text-textMuted tracking-wider leading-relaxed select-none">
              &gt; COGNITIVE BYPASS PROTOCOL: <span className="text-neonCyan animate-pulse">ACTIVE</span>
            </div>
            {/* Height 12/48px container with overflow-visible to let button escape */}
            <div className="relative h-12 flex items-center justify-center overflow-visible">
              <DodgingButton onCatch={triggerCatch} />
            </div>
          </div>
        </div>
      </div>

      {/* Easter Egg Toast */}
      {showBreachToast && (
        <div
          style={{
            borderColor: "#22d3ee",
            backgroundColor: "#0a0b10",
            boxShadow: "0 0 15px rgba(34, 211, 238, 0.25)",
          }}
          className="fixed bottom-6 right-6 z-50 border-2 px-6 py-4 rounded flex items-center gap-3 animate-page-fade font-display"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-neonCyan animate-ping"></div>
          <div>
            <div className="text-xs font-black text-neonCyan uppercase tracking-widest">
              SYSTEM BREACH SUCCESSFUL
            </div>
            <div className="text-[10px] text-textMuted mt-1">
              You found the easter egg.
            </div>
          </div>
          <button
            onClick={() => setShowBreachToast(false)}
            className="text-[10px] text-textMuted hover:text-neonCyan ml-4 focus:outline-none cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Glitch Overlay */}
      {isGlitching && (
        <div
          style={{ backgroundColor: "#0a0b10" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center select-none font-mono animate-glitch-flicker animate-glitch-shake"
        >
          {/* CRITICAL ALARM EFFECT */}
          <div className="absolute inset-0 bg-[#ef4444]/5 pointer-events-none"></div>

          {/* Glitch Box */}
          <div
            style={{ borderColor: "#ef4444" }}
            className="border-2 border-double max-w-xl w-full p-8 bg-black/90 rounded relative shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          >
            {/* Corner Indicators */}
            <span className="absolute top-2 left-2 text-[10px] text-[#ef4444] font-bold">SYSTEM_LOCKOUT</span>
            <span className="absolute bottom-2 right-2 text-[10px] text-[#ef4444] font-bold">ERR_0xDEADBEEF</span>

            <div className="text-4xl mb-4">⚠️</div>

            <h2 className="text-[#ef4444] text-xl md:text-2xl font-black tracking-widest uppercase mb-4 animate-pulse">
              ACCESS DENIED — NICE TRY
            </h2>

            <div className="text-left text-xs space-y-2 text-textMuted border-t border-[#ef4444]/20 pt-4 max-w-md mx-auto">
              <p className="text-[#a855f7]">&gt; COGNITIVE BYPASS PROTOCOL DETECTED</p>
              <p>&gt; IP SOURCE: USER_IMPATIENT_BRAIN</p>
              <p>&gt; INTERCEPTED BY: Mainframe Security Layer</p>
              <p className="text-[#22d3ee] animate-pulse">&gt; REBOOTING SECURITY INTERFACE IN 1.5s...</p>
            </div>

            {/* Fake progress bar */}
            <div className="w-full bg-[#12131e] h-1.5 mt-6 rounded overflow-hidden border border-[#ef4444]/20">
              <div
                style={{ backgroundColor: "#ef4444" }}
                className="h-full w-full animate-[loading-bar_1.5s_linear_infinite]"
              ></div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes glitch-flicker {
              0% { opacity: 0.98; }
              50% { opacity: 0.95; }
              100% { opacity: 0.99; }
            }
            @keyframes glitch-shake {
              0%, 100% { transform: translate(0, 0); }
              10% { transform: translate(-1px, 1px); }
              30% { transform: translate(1px, -1px); }
              50% { transform: translate(-1px, 1.5px); }
              70% { transform: translate(1.5px, 0.5px); }
              90% { transform: translate(-0.5px, -1px); }
            }
            @keyframes loading-bar {
              0% { width: 0%; }
              100% { width: 100%; }
            }
            .animate-glitch-flicker {
              animation: glitch-flicker 0.15s infinite;
            }
            .animate-glitch-shake {
              animation: glitch-shake 0.25s infinite;
            }
          `}} />
        </div>
      )}
    </div>
  );
}

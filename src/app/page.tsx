"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";
import { categories } from "../lib/categories";

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

const BOOT_LINES = [
  "INITIALIZING IQ-OS CORE MAINFRAME...",
  "LOADING ADAPTIVE DIFFICULTY ENGINE...",
  "ESTABLISHING SECURE DATABASE LINK...",
  "SYNCING REAL-TIME QUESTION GENERATOR...",
  "DECRYPTING SECURITY CHANNELS...",
  "ACCESS GRANTED. WELCOME, OPERATOR.",
];

export default function Home() {
  // Live Preview Interactive State
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Easter Egg States
  const [showBreachToast, setShowBreachToast] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Boot Sequence States
  const [showBoot, setShowBoot] = useState(false);
  const [fadeBoot, setFadeBoot] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  // Node Map Tooltip State
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const glitchTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if boot sequence already run in session
    const completed = sessionStorage.getItem("boot_sequence_completed");
    if (!completed) {
      setShowBoot(true);
    }
  }, []);

  useEffect(() => {
    if (!showBoot) return;

    let timer: NodeJS.Timeout;
    const nextLine = (idx: number) => {
      if (idx < BOOT_LINES.length) {
        setBootProgress(idx + 1);
        timer = setTimeout(() => nextLine(idx + 1), 400);
      } else {
        timer = setTimeout(() => {
          handleCompleteBoot();
        }, 500);
      }
    };

    nextLine(0);

    return () => clearTimeout(timer);
  }, [showBoot]);

  const handleCompleteBoot = () => {
    setFadeBoot(true);
    sessionStorage.setItem("boot_sequence_completed", "true");
    setTimeout(() => {
      setShowBoot(false);
    }, 500);
  };

  useEffect(() => {
    // Print styled Console Easter Egg once on mount
    console.log(
      `%c\n  ___                             _ _     _      _____             _ \n |_ _|_ __  _ __   ___  ___  ___ (_) |__ | | ___|  _  \\ _   _ _ __ | |\n  | || '_ \\| '_ \\ / _ \\/ __|/ __|| | '_ \\| |/ _ \\ | |  | | | | '_ \\| |\n  | || |_) | |_) | (_) \\__ \\__ \\| | |_) | |  __/ |_|  | |_| | |_) |_|\n |___| .__/| .__/ \\___/|___/___/|_|_.__/|_|\\___|_____/ \\__,_| .__/(_)\n     |_|   |_|                                              |_|      \n\n%cLooking for bugs? So am I. — Ahmad & Jules\n`,
      "color: #a855f7; font-weight: bold; font-family: monospace; text-shadow: 0 0 5px rgba(168, 85, 247, 0.5); font-size: 11px;",
      "color: #22d3ee; font-weight: bold; font-family: monospace; font-size: 12px; padding-top: 10px;"
    );

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
      {/* Boot Sequence Full Screen Overlay */}
      {showBoot && (
        <div
          style={{
            backgroundColor: "#0a0b10",
            transition: "opacity 0.5s ease-out",
            opacity: fadeBoot ? 0 : 1,
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-between p-8 md:p-16 select-none font-mono"
        >
          {/* Decorative Corner Grid Bars */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-neonViolet/40"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-neonViolet/40"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-neonViolet/40"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-neonViolet/40"></div>

          {/* Core Boot Sequence Terminal Output */}
          <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
            {/* Fake terminal header decoration */}
            <div className="flex items-center gap-1.5 border-b border-neonViolet/10 pb-3 mb-6 select-none">
              <div className="w-2.5 h-2.5 rounded-full bg-neonViolet animate-pulse"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-neonCyan"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-textMuted/40"></div>
              <span className="text-[10px] text-textMuted/60 uppercase ml-2 tracking-widest font-bold">
                IQ-OS // SYS_BOOT_SEQUENCE_v1.0
              </span>
            </div>

            <div className="space-y-4">
              {BOOT_LINES.slice(0, bootProgress).map((line, index) => {
                const isLast = index === bootProgress - 1;
                const isAccessGranted = index === BOOT_LINES.length - 1;
                return (
                  <div
                    key={index}
                    className={`text-xs md:text-sm tracking-wider font-bold transition-all duration-300 ${
                      isAccessGranted
                        ? "text-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] scale-105 origin-left"
                        : isLast
                        ? "text-neonViolet animate-pulse"
                        : "text-textMuted"
                    }`}
                  >
                    &gt; {line}
                  </div>
                );
              })}
              {bootProgress < BOOT_LINES.length && (
                <div className="text-xs text-neonViolet animate-pulse flex items-center gap-1.5 mt-2">
                  <span>&gt; BOOTING</span>
                  <span className="inline-block w-1.5 h-4 bg-neonViolet animate-blink"></span>
                </div>
              )}
            </div>
          </div>

          {/* Skip Button Placement: bottom-right corner, small neon-accented monospace */}
          <div className="flex justify-end w-full relative z-10">
            <button
              onClick={handleCompleteBoot}
              style={{
                borderColor: "#a855f7",
                color: "#a855f7",
                backgroundColor: "rgba(168, 85, 247, 0.05)",
              }}
              className="px-4 py-2 border rounded font-mono text-[10px] tracking-widest uppercase hover:bg-neonViolet/10 hover:text-textPrimary hover:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all duration-200 cursor-pointer"
            >
              SKIP BOOT
            </button>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes blink {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
            .animate-blink {
              animation: blink 0.8s infinite;
            }
          `}} />
        </div>
      )}

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
          <h2 className="text-xs font-black font-display tracking-widest text-neonCyan uppercase mb-8 text-center">
            SYSTEM_ARCHITECTURE // MAIN_FEATURES
          </h2>
        </ScrollReveal>

        {/* Compact Concept Copy Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <ScrollReveal>
            <div className="p-4 rounded border border-neonViolet/10 bg-bgDark/40 text-center h-full hover:border-neonCyan/30 transition-colors duration-300">
              <div className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-1.5">
                01 // DYNAMIC GENERATION
              </div>
              <p className="text-xs text-textMuted leading-relaxed">
                Every trivia challenge is forged in real time by the Gemini core mainframe — ensuring no two sessions are ever identical.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="p-4 rounded border border-neonViolet/10 bg-bgDark/40 text-center h-full hover:border-neonCyan/30 transition-colors duration-300">
              <div className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-1.5">
                02 // ADAPTIVE ENGINE
              </div>
              <p className="text-xs text-textMuted leading-relaxed">
                Our lightweight Python serverless engine computes your trajectory after every answer to adapt challenges to your caliber.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="p-4 rounded border border-neonViolet/10 bg-bgDark/40 text-center h-full hover:border-neonCyan/30 transition-colors duration-300">
              <div className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-1.5">
                03 // CORE BOSS ROUND
              </div>
              <p className="text-xs text-textMuted leading-relaxed">
                Survive 3 consecutive Hard problems to activate the ultimate Boss Security layer. Clear it to etch your handle on our leaderboard.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Interactive Category Node Map */}
        <div className="w-full max-w-5xl mx-auto py-8">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h3 className="text-xs font-black font-display tracking-widest text-neonViolet uppercase mb-2">
                MAINFRAME // SECTOR_NODE_MAP
              </h3>
              <p className="text-[10px] text-textMuted uppercase tracking-wider font-semibold">
                Hover/Focus a node to view sector metrics // Click to establish direct link
              </p>
            </div>

            {/* Svg and Node constellation container */}
            <div className="relative w-full max-w-3xl mx-auto aspect-[800/480] bg-bgDark/20 border border-neonViolet/15 rounded-lg overflow-hidden shadow-[0_0_35px_rgba(168,85,247,0.03)]">
              {/* SVG Background Lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 800 480"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Connections with Dual Lines for Glow and High Fidelity */}
                {[
                  { x1: 150, y1: 100, x2: 400, y2: 70 }, // Prog -> Logic
                  { x1: 400, y1: 70, x2: 650, y2: 100 }, // Logic -> Data
                  { x1: 650, y1: 100, x2: 650, y2: 380 }, // Data -> Eng
                  { x1: 650, y1: 380, x2: 400, y2: 410 }, // Eng -> Business
                  { x1: 400, y1: 410, x2: 150, y2: 380 }, // Business -> CS Fundamentals
                  { x1: 150, y1: 380, x2: 150, y2: 100 }, // CS Fundamentals -> Prog
                  { x1: 150, y1: 100, x2: 150, y2: 380 }, // Vertical Divider: Prog -> CS Fundamentals
                  { x1: 400, y1: 70, x2: 400, y2: 410 }, // Vertical Divider: Logic -> Business
                  { x1: 650, y1: 100, x2: 650, y2: 380 }, // Vertical Divider: Data -> Eng
                ].map((line, i) => (
                  <g key={i}>
                    <line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="#a855f7"
                      strokeWidth="3.5"
                      strokeOpacity="0.15"
                    />
                    <line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="#22d3ee"
                      strokeWidth="1.2"
                      strokeOpacity="0.6"
                    />
                  </g>
                ))}
              </svg>

              {/* Interactive HTML Buttons positioned precisely using coordinate-to-percentage conversion */}
              {categories.map((cat) => {
                // Determine layout coordinates
                let left = "50%";
                let top = "50%";
                if (cat.id === "programming") { left = "18.75%"; top = "20.83%"; }
                else if (cat.id === "logic-algorithms") { left = "50%"; top = "14.58%"; }
                else if (cat.id === "data-analytics") { left = "81.25%"; top = "20.83%"; }
                else if (cat.id === "computer-science-fundamentals") { left = "18.75%"; top = "79.17%"; }
                else if (cat.id === "business") { left = "50%"; top = "85.42%"; }
                else if (cat.id === "english") { left = "81.25%"; top = "79.17%"; }

                return (
                  <div
                    key={cat.id}
                    style={{ left, top }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                  >
                    {/* Interactive Link/Button Node */}
                    <Link
                      href={cat.href}
                      aria-label={`Enter sector: ${cat.title}. Description: ${cat.desc}`}
                      onMouseEnter={() => setActiveTooltipId(cat.id)}
                      onMouseLeave={() => setActiveTooltipId(null)}
                      onFocus={() => setActiveTooltipId(cat.id)}
                      onBlur={() => setActiveTooltipId(null)}
                      className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0a0b10] border-2 border-neonViolet/30 hover:border-neonCyan focus:border-neonCyan hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 flex items-center justify-center cursor-pointer outline-none group-hover:scale-105 active:scale-95 [&_svg]:w-6 [&_svg]:h-6 md:[&_svg]:w-7 md:[&_svg]:h-7"
                    >
                      {/* Inner glowing effect */}
                      <div className="absolute inset-0.5 rounded-full bg-[#0a0b10] border border-neonViolet/10 group-hover:border-neonCyan/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="text-neonCyan group-hover:text-neonViolet transition-colors duration-300 flex items-center justify-center">
                          {cat.icon}
                        </div>
                      </div>
                    </Link>

                    {/* Node Label (shows name under/above the node) */}
                    <span className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold tracking-widest text-textMuted uppercase group-hover:text-neonCyan transition-colors duration-300">
                      {cat.title === "Computer Science Fundamentals" ? "CS FUNDAMENTALS" : cat.title}
                    </span>

                    {/* Styled absolute-positioned Tooltip */}
                    {activeTooltipId === cat.id && (
                      <div
                        style={{
                          borderColor: "#22d3ee",
                          backgroundColor: "#0a0b10",
                          boxShadow: "0 0 15px rgba(34, 211, 238, 0.25)",
                        }}
                        className="absolute z-30 bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 p-3.5 rounded border w-60 text-center select-none pointer-events-none animate-page-fade font-mono"
                      >
                        {/* Decorative header */}
                        <div className="flex justify-between items-center mb-1.5 text-[8px] text-neonCyan tracking-widest uppercase font-bold">
                          <span>[{cat.tag}]</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-neonCyan animate-pulse"></span>
                        </div>
                        <div className="text-[11px] font-bold text-textPrimary uppercase mb-1 font-display">
                          {cat.title}
                        </div>
                        <p className="text-[10px] text-textMuted leading-relaxed normal-case">
                          {cat.desc}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
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
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 flex justify-end h-16 relative">
        <div className="relative">
          <DodgingButton onCatch={triggerCatch} />
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

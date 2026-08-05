"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCumulativeXP } from "../lib/achievements";

import { isSoundEnabled, setSoundEnabled } from "../lib/sound";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [cumulativeXP, setCumulativeXP] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  // Read cumulative XP and sound state on mount and react to updates
  useEffect(() => {
    setMounted(true);
    setCumulativeXP(getCumulativeXP());
    setSoundOn(isSoundEnabled());

    const handleXpUpdate = () => {
      setCumulativeXP(getCumulativeXP());
    };

    const handleSoundToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSoundOn(customEvent.detail);
    };

    window.addEventListener("xp-updated", handleXpUpdate);
    window.addEventListener("sound-toggle-updated", handleSoundToggle);
    return () => {
      window.removeEventListener("xp-updated", handleXpUpdate);
      window.removeEventListener("sound-toggle-updated", handleSoundToggle);
    };
  }, []);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let startTime = sessionStorage.getItem("session_start_time");
    if (!startTime) {
      startTime = Date.now().toString();
      sessionStorage.setItem("session_start_time", startTime);
    }

    const startTimeNum = Number(startTime);

    const updateUptime = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - startTimeNum) / 1000));
      setUptimeSeconds(diff);
    };

    updateUptime();

    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bgDark border-t border-neonViolet/40 shadow-[0_-4px_20px_rgba(168,85,247,0.18)] py-8 px-6 md:px-12 relative overflow-hidden select-none">
      {/* Absolute faint accent light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[80px] rounded-full bg-neonViolet/5 blur-2xl pointer-events-none"></div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0px rgba(34, 211, 238, 0.4);
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
            box-shadow: 0 0 8px 3px rgba(34, 211, 238, 0.6);
          }
        }
        .pulse-dot {
          animation: pulse-dot 2s infinite ease-in-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6">
        {/* Row 1: System Status Dashboard Readout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center border border-neonViolet/20 bg-bgDark/40 p-4 rounded font-mono text-xs md:text-sm tracking-widest text-textMuted">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <span className="text-neonViolet/60">STATUS:</span>
            <span className="text-neonCyan font-bold flex items-center gap-2">
              ONLINE
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-neonCyan pulse-dot" />
            </span>
          </div>

          {/* Uptime Counter */}
          <div className="flex items-center gap-2 justify-center">
            <span className="text-neonViolet/60">UPTIME:</span>
            <span className="text-textPrimary font-bold tabular-nums">
              {mounted ? formatUptime(uptimeSeconds) : "00:00:00"}
            </span>
          </div>

          {/* Cumulative XP Counter Display */}
          <div className="flex items-center gap-2 justify-center">
            <span className="text-neonViolet/60">XP TOTAL:</span>
            <span className="text-neonCyan font-black animate-pulse">
              {mounted ? cumulativeXP.toLocaleString() : "0"} XP
            </span>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center gap-2 justify-center">
            <span className="text-neonViolet/60">AUDIO:</span>
            <button
              onClick={toggleSound}
              className="text-neonCyan font-bold hover:text-textPrimary transition-all duration-300 focus:outline-none"
            >
              {mounted && soundOn ? "[ 🔊 ON ]" : "[ 🔇 OFF ]"}
            </button>
          </div>

          {/* Build Version */}
          <div className="flex items-center gap-2 justify-center lg:justify-end">
            <span className="text-neonViolet/60">BUILD:</span>
            <span className="text-neonCyan font-bold">
              v1.0-STABLE
            </span>
          </div>
        </div>

        {/* Row 2: Route Links formatted as System Outputs */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-textMuted font-mono text-xs md:text-sm py-1">
          <span className="text-neonViolet font-bold">{"> ROUTES:"}</span>
          <Link href="/" className="hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-300 ease-in-out">
            cd /home
          </Link>
          <span className="text-neonViolet/40 select-none">{"//"}</span>
          <Link href="/categories" className="hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-300 ease-in-out">
            cd /categories
          </Link>
          <span className="text-neonViolet/40 select-none">{"//"}</span>
          <Link href="/leaderboard" className="hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-300 ease-in-out">
            cd /leaderboard
          </Link>
          <span className="text-neonViolet/40 select-none">{"//"}</span>
          <Link href="/escape-room" className="hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-300 ease-in-out">
            ./escape-room
          </Link>
          <span className="text-neonViolet/40 select-none">{"//"}</span>
          <Link href="/achievements" className="hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-300 ease-in-out">
            cd /achievements
          </Link>
          <span className="text-neonViolet/40 select-none">{"//"}</span>
          <Link href="/about" className="hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-300 ease-in-out font-bold text-neonCyan">
            cat about.md
          </Link>
        </div>

        {/* Separator Divider Line */}
        <div className="w-full h-[1px] bg-neonViolet/15"></div>

        {/* Row 3: Operator detail & Logs */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          {/* Operator attribution */}
          <div className="flex items-center gap-1.5 text-textMuted text-center sm:text-left">
            <span className="text-neonViolet/60">{"> OPERATOR:"}</span>
            <Link
              href="/about"
              className="text-neonCyan font-bold hover:text-neonViolet hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.4)] transition-all duration-300 ease-in-out"
            >
              Muhammad Ahmad Khan
            </Link>
          </div>

          {/* System status log and copyright */}
          <div className="text-[10px] text-textMuted/40 tracking-wider text-center sm:text-right select-none">
            {`[SYS_LOG] © ${mounted ? currentYear : "2026"} // ALL SYSTEMS OPERATIONAL`}
          </div>
        </div>
      </div>
    </footer>
  );
}

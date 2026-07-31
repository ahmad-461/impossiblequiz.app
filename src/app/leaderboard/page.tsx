"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  rank: string;
  nickname: string;
  score: number;
  rate: string;
  tag: string;
  highlight?: boolean;
}

const DEFAULT_LEADERBOARDS: LeaderboardEntry[] = [
  { rank: "01", nickname: "Slayer_Dev", score: 9980, rate: "100%", tag: "CS_FOUND" },
  { rank: "02", nickname: "NullPointerEx", score: 9450, rate: "90%", tag: "PROG_LANG" },
  { rank: "03", nickname: "DataWizard_88", score: 9120, rate: "90%", tag: "DATA_SCALE" },
  { rank: "04", nickname: "ByteCommander", score: 8840, rate: "80%", tag: "LOGIC_ALG" },
];

export default function LeaderboardPage() {
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let userScoreEntry: LeaderboardEntry | null = null;

    try {
      const stored = sessionStorage.getItem("impossible_quiz_result");
      if (stored) {
        const parsed = JSON.parse(stored);

        // Convert category ID to standard short tag
        let tag = "SYS.CORE";
        if (parsed.category === "programming") tag = "SYS.LANG";
        if (parsed.category === "logic-algorithms") tag = "ALG.COMP";
        if (parsed.category === "data-analytics") tag = "DAT.SCALE";

        userScoreEntry = {
          rank: "--", // Will be recalculated
          nickname: "You (Survivor)",
          score: parsed.score || 0,
          rate: `${parsed.accuracy || 0}%`,
          tag,
          highlight: true,
        };
      }
    } catch (e) {
      console.error("Error loading user results on leaderboard:", e);
    }

    // If no user run, put the default 5th rank entry
    if (!userScoreEntry) {
      userScoreEntry = {
        rank: "05",
        nickname: "You (Survivor)",
        score: 8420,
        rate: "90%",
        tag: "SYS.CORE",
        highlight: true,
      };
    }

    // Merge and sort
    const allEntries = [...DEFAULT_LEADERBOARDS];
    // Avoid double adding
    if (userScoreEntry) {
      allEntries.push(userScoreEntry);
    }

    // Sort descending by score
    allEntries.sort((a, b) => b.score - a.score);

    // Re-assign ranks
    const finalBoard = allEntries.map((entry, idx) => {
      const rankNum = idx + 1;
      const rankStr = rankNum < 10 ? `0${rankNum}` : `${rankNum}`;
      return {
        ...entry,
        rank: rankStr,
      };
    });

    setBoard(finalBoard);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full select-none">
      {/* Scoreboard Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonViolet/10 border border-neonViolet/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-neonViolet uppercase font-mono">
        {"GLOBAL_ARCHIVE // TOP_RECORDS"}
      </div>

      <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-center">
        HALL OF{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          CHAMPIONS
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-12">
        Only the fastest minds make the cut. High performance is permanently etched into our virtual mainframe.
      </p>

      {/* Styled Esports Main Scoreboard */}
      <div className="w-full rounded-lg bg-bgDark border-2 border-neonViolet/30 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.1)] mb-10">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 bg-neonViolet/10 px-6 py-4 border-b border-neonViolet/20 text-xs font-mono tracking-widest text-neonCyan font-bold uppercase">
          <div className="col-span-2">RANK</div>
          <div className="col-span-5">NICKNAME</div>
          <div className="col-span-3 text-right">ACCURACY</div>
          <div className="col-span-2 text-right">SCORE</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-neonViolet/10">
          {board.map((entry, index) => (
            <div
              key={`${entry.nickname}-${index}`}
              className={`grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm font-semibold transition-all duration-200 ${
                entry.highlight
                  ? "bg-neonCyan/10 border-l-4 border-neonCyan text-textPrimary shadow-[inset_0_0_12px_rgba(34,211,238,0.15)]"
                  : "hover:bg-neonViolet/5 text-textMuted hover:text-textPrimary"
              }`}
            >
              {/* Rank */}
              <div className={`col-span-2 font-mono font-bold ${entry.highlight ? "text-neonCyan" : "text-neonViolet"}`}>
                #{entry.rank}
              </div>

              {/* Nickname & Class Tag */}
              <div className="col-span-5 flex items-center gap-3">
                <span className={entry.highlight ? "text-neonCyan font-black" : "text-textPrimary"}>
                  {entry.nickname}
                </span>
                <span className="hidden sm:inline text-[10px] font-mono tracking-wider bg-bgDark border border-neonViolet/20 px-1.5 py-0.5 rounded text-neonViolet">
                  {entry.tag}
                </span>
              </div>

              {/* Accuracy Rate */}
              <div className="col-span-3 text-right font-mono text-xs">
                {entry.rate}
              </div>

              {/* Final Score */}
              <div className={`col-span-2 text-right font-mono font-bold ${entry.highlight ? "text-neonCyan" : "text-textPrimary"}`}>
                {entry.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Home CTA */}
      <Link
        href="/"
        className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-md bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none focus:ring-2 focus:ring-neonCyan shadow-[0_0_12px_rgba(168,85,247,0.4)] hover:shadow-[0_0_22px_rgba(34,211,238,0.7)] border border-transparent hover:border-neonCyan"
      >
        <span className="absolute inset-0 w-full h-full rounded-md bg-gradient-to-r from-neonViolet to-neonCyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></span>
        BACK TO HOME
      </Link>
    </div>
  );
}

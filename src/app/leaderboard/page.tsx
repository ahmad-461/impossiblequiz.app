"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import SystemLogLoader from "../../components/SystemLogLoader";

interface LeaderboardEntry {
  id?: string;
  rank?: string;
  nickname: string;
  score: number;
  streak: number;
  category: string;
  highlight?: boolean;
}

const SECTORS = [
  { id: "all", label: "ALL SECTORS", tag: "ALL" },
  { id: "programming", label: "PROGRAMMING", tag: "SYS.LANG" },
  { id: "logic-algorithms", label: "LOGIC // ALGO", tag: "ALG.COMP" },
  { id: "data-analytics", label: "DATA ANALYTICS", tag: "DAT.SCALE" },
  { id: "computer-science-fundamentals", label: "CS FUNDAMENTALS", tag: "SYS.CORE" },
];

const MOCK_LEADERBOARDS: LeaderboardEntry[] = [
  { id: "mock_1", nickname: "Slayer_Dev", score: 9980, streak: 8, category: "computer-science-fundamentals" },
  { id: "mock_2", nickname: "NullPointerEx", score: 9450, streak: 7, category: "programming" },
  { id: "mock_3", nickname: "DataWizard_88", score: 9120, streak: 6, category: "data-analytics" },
  { id: "mock_4", nickname: "ByteCommander", score: 8840, streak: 5, category: "logic-algorithms" },
];

const getCategoryLabel = (cat: string): string => {
  if (cat.startsWith("programming_")) {
    const parts = cat.split("_");
    const langRaw = parts[1] || "";
    const diffRaw = parts[2] || "";

    const langMapping: Record<string, string> = {
      python: "Python",
      java: "Java",
      javascript: "JS",
      c: "C",
      cpp: "C++",
      csharp: "C#",
      php: "PHP",
      typescript: "TS",
      go: "Go",
      rust: "Rust",
      kotlin: "Kotlin",
      swift: "Swift",
    };

    const formattedLang = langMapping[langRaw.toLowerCase()] || langRaw.toUpperCase();
    const formattedDiff = diffRaw.charAt(0).toUpperCase(); // E, M, H, I
    return `${formattedLang} (${formattedDiff})`;
  }

  const mapping: Record<string, string> = {
    programming: "SYS.LANG",
    "logic-algorithms": "ALG.COMP",
    "data-analytics": "DAT.SCALE",
    "computer-science-fundamentals": "SYS.CORE",
  };
  return mapping[cat] || "SYS.CORE";
};

function LeaderboardContent() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Retrieve user results state from sessionStorage
  const getUserSessionResult = () => {
    try {
      const stored = sessionStorage.getItem("impossible_quiz_result");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading sessionStorage on leaderboard page:", e);
    }
    return null;
  };

  useEffect(() => {
    const sessionResult = getUserSessionResult();
    if (sessionResult && sessionResult.category) {
      if (sessionResult.category.startsWith("programming_")) {
        setActiveCategory("programming");
      } else {
        setActiveCategory(sessionResult.category);
      }
    }
  }, []);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      setIsOffline(false);

      const sessionResult = getUserSessionResult();
      const submittedId = sessionResult?.submittedId;
      const sessionNickname = sessionResult?.nickname || "You (Survivor)";
      const sessionScore = sessionResult?.score || 0;
      const sessionStreak = sessionResult?.peakStreak || 0;
      const sessionCategory = sessionResult?.category || "programming";

      const matchCategory = activeCategory === "all" ||
        sessionCategory === activeCategory ||
        (activeCategory === "programming" && sessionCategory.startsWith("programming_"));

      try {
        let query = supabase.from("leaderboard").select("id, nickname, score, streak, category");

        if (activeCategory !== "all") {
          if (activeCategory === "programming") {
            query = query.or("category.eq.programming,category.like.programming_%");
          } else {
            query = query.eq("category", activeCategory);
          }
        }

        const { data, error } = await query.order("score", { ascending: false }).limit(10);

        if (error || !data || data.length === 0) {
          throw new Error("Supabase offline or empty");
        }

        const finalEntries: LeaderboardEntry[] = (data as Array<{ id: string; nickname: string; score: number; streak: number; category: string }>).map((item) => ({
          id: String(item.id),
          nickname: String(item.nickname || ""),
          score: Number(item.score || 0),
          streak: Number(item.streak || 0),
          category: String(item.category || ""),
          highlight: submittedId ? item.id === submittedId : false,
        }));

        const hasHighlighted = finalEntries.some((e) => e.highlight);
        if (!hasHighlighted && sessionResult && sessionResult.submitted) {
          if (matchCategory) {
            const userEntry: LeaderboardEntry = {
              id: submittedId || "user_run",
              nickname: sessionNickname,
              score: sessionScore,
              streak: sessionStreak,
              category: sessionCategory,
              highlight: true,
            };
            finalEntries.push(userEntry);
          }
        }

        finalEntries.sort((a, b) => b.score - a.score);

        const rankedBoard = finalEntries.map((entry, idx) => {
          const rankNum = idx + 1;
          const rankStr = rankNum < 10 ? `0${rankNum}` : `${rankNum}`;
          return { ...entry, rank: rankStr };
        });

        setBoard(rankedBoard);
      } catch (err) {
        console.warn("Load leaderboard failed, fallback to local:", err);
        setIsOffline(true);

        let fallbackList = [...MOCK_LEADERBOARDS];
        if (activeCategory !== "all") {
          fallbackList = fallbackList.filter((e) => {
            if (activeCategory === "programming") {
              return e.category === "programming" || e.category.startsWith("programming_");
            }
            return e.category === activeCategory;
          });
        }

        if (sessionResult) {
          if (matchCategory) {
            fallbackList.push({
              id: "local_user",
              nickname: sessionNickname,
              score: sessionScore,
              streak: sessionStreak,
              category: sessionCategory,
              highlight: true,
            });
          }
        }

        fallbackList.sort((a, b) => b.score - a.score);

        const rankedFallback = fallbackList.map((entry, idx) => {
          const rankNum = idx + 1;
          const rankStr = rankNum < 10 ? `0${rankNum}` : `${rankNum}`;
          return { ...entry, rank: rankStr };
        });

        setBoard(rankedFallback);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [activeCategory]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full select-none animate-page-fade">

      {/* Scoreboard Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonViolet/10 border border-neonViolet/30 px-4 py-1.5 rounded-full text-xs font-semibold font-display tracking-widest text-neonViolet uppercase">
        {"GLOBAL_ARCHIVE // TOP_RECORDS"}
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-3 text-center uppercase">
        HALL OF{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          CHAMPIONS
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-8 leading-relaxed">
        Only the fastest minds make the cut. High performance is permanently etched into our virtual mainframe.
      </p>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8 w-full">
        {SECTORS.map((sector) => (
          <button
            key={sector.id}
            onClick={() => setActiveCategory(sector.id)}
            aria-label={`Filter sector by ${sector.label}`}
            className={`px-4 py-2 rounded text-xs font-display font-bold tracking-widest uppercase transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-neonCyan ${
              activeCategory === sector.id
                ? "bg-neonCyan/10 border-neonCyan text-neonCyan shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                : "bg-bgDark/40 border-neonViolet/20 text-textMuted hover:border-neonViolet/60 hover:text-textPrimary"
            }`}
          >
            {sector.label}
          </button>
        ))}
      </div>

      {/* Network Offline Alert Badge */}
      {isOffline && (
        <div className="w-full py-3 px-4 rounded mb-6 border border-neonViolet/30 bg-neonViolet/5 text-neonViolet font-display text-[11px] text-center tracking-wider">
          ⚡ MAINFRAME OFFLINE: USING LOCAL SIMULATOR DATABASE ⚡
        </div>
      )}

      {/* Styled Esports Main Scoreboard */}
      <div className="w-full rounded-lg bg-bgDark border-2 border-neonViolet/30 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.1)] mb-10 font-display">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 bg-neonViolet/10 px-6 py-4 border-b border-neonViolet/20 text-xs tracking-widest text-neonCyan font-bold uppercase select-none">
          <div className="col-span-2">RANK</div>
          <div className="col-span-5">NICKNAME</div>
          <div className="col-span-3 text-right">STREAK</div>
          <div className="col-span-2 text-right">SCORE</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-neonViolet/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <SystemLogLoader context="leaderboard" />
            </div>
          ) : board.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-xs tracking-widest text-textMuted uppercase font-semibold">
                NO ENTRIES RECOVERED IN THIS SECTOR
              </span>
            </div>
          ) : (
            board.map((entry, index) => (
              <div
                key={`${entry.nickname}-${index}`}
                className={`grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm font-semibold transition-all duration-200 ${
                  entry.highlight
                    ? "bg-neonCyan/10 border-l-4 border-neonCyan text-textPrimary shadow-[inset_0_0_12px_rgba(34,211,238,0.15)]"
                    : "hover:bg-neonViolet/5 text-textMuted hover:text-textPrimary"
                }`}
              >
                {/* Rank */}
                <div className={`col-span-2 font-bold ${entry.highlight ? "text-neonCyan animate-pulse" : "text-neonViolet"}`}>
                  #{entry.rank}
                </div>

                {/* Nickname & Class Tag */}
                <div className="col-span-5 flex items-center gap-3">
                  <span className={entry.highlight ? "text-neonCyan font-black" : "text-textPrimary"}>
                    {entry.nickname}
                  </span>
                  <span className="hidden sm:inline text-[9px] tracking-wider bg-bgDark border border-neonViolet/20 px-1.5 py-0.5 rounded text-neonViolet font-bold">
                    {getCategoryLabel(entry.category)}
                  </span>
                </div>

                {/* Streak */}
                <div className="col-span-3 text-right text-xs flex items-center justify-end gap-1 text-neonViolet font-bold">
                  <span>{entry.streak}</span>
                  <span>🔥</span>
                </div>

                {/* Final Score */}
                <div className={`col-span-2 text-right font-bold ${entry.highlight ? "text-neonCyan animate-pulse" : "text-textPrimary"}`}>
                  {entry.score.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Back to Home CTA */}
      <Link
        href="/"
        className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none focus:ring-2 focus:ring-neonCyan shadow-[0_0_12px_rgba(168,85,247,0.4)] hover:shadow-[0_0_22px_rgba(34,211,238,0.7)] border border-transparent hover:border-neonCyan font-display"
      >
        <span className="absolute inset-0 w-full h-full rounded bg-gradient-to-r from-neonViolet to-neonCyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></span>
        BACK TO HOME
      </Link>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <SystemLogLoader context="leaderboard" />
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
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

interface RecentSubmission {
  nickname: string;
  category: string;
  score: number;
  streak: number;
}

const SECTORS = [
  { id: "all", label: "ALL SECTORS", tag: "ALL" },
  { id: "programming", label: "PROGRAMMING", tag: "SYS.LANG" },
  { id: "business", label: "BUSINESS", tag: "BUS.MGMT" },
  { id: "english", label: "ENGLISH", tag: "ENG.LANG" },
  { id: "logic-algorithms", label: "LOGIC // ALGO", tag: "ALG.COMP" },
  { id: "data-analytics", label: "DATA ANALYTICS", tag: "DAT.SCALE" },
  { id: "computer-science-fundamentals", label: "CS FUNDAMENTALS", tag: "SYS.CORE" },
];

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

  if (cat.startsWith("business_")) {
    const parts = cat.split("_");
    const subRaw = parts[1] || "";
    const diffRaw = parts[2] || "";

    const subMapping: Record<string, string> = {
      marketing: "Marketing",
      finance: "Finance",
      accounting: "Accounting",
      entrepreneurship: "Entrep.",
      management: "Mgmt",
      economics: "Econ",
      "business-strategy": "Strategy",
    };

    const formattedSub = subMapping[subRaw.toLowerCase()] || subRaw.toUpperCase();
    const formattedDiff = diffRaw.charAt(0).toUpperCase(); // E, M, H, I
    return `${formattedSub} (${formattedDiff})`;
  }

  if (cat.startsWith("english_")) {
    const parts = cat.split("_");
    const subRaw = parts[1] || "";
    const diffRaw = parts[2] || "";

    const subMapping: Record<string, string> = {
      grammar: "Grammar",
      vocabulary: "Vocab",
      "synonyms-antonyms": "Syn/Ant",
      tenses: "Tenses",
      "sentence-correction": "Correction",
      "idioms-phrases": "Idioms",
      "reading-comprehension": "Compreh.",
    };

    const formattedSub = subMapping[subRaw.toLowerCase()] || subRaw.toUpperCase();
    const formattedDiff = diffRaw.charAt(0).toUpperCase(); // E, M, H, I
    return `${formattedSub} (${formattedDiff})`;
  }

  const mapping: Record<string, string> = {
    programming: "SYS.LANG",
    business: "BUS.MGMT",
    english: "ENG.LANG",
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
  const [error, setError] = useState<string | null>(null);
  const [recentFeeds, setRecentFeeds] = useState<RecentSubmission[]>([]);

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
      } else if (sessionResult.category.startsWith("business_")) {
        setActiveCategory("business");
      } else if (sessionResult.category.startsWith("english_")) {
        setActiveCategory("english");
      } else {
        setActiveCategory(sessionResult.category);
      }
    }

    // Fetch live feed data
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
    fetchRecentSubmissions();
  }, []);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const sessionResult = getUserSessionResult();
    const submittedId = sessionResult?.submittedId;
    const sessionNickname = sessionResult?.nickname || "You (Survivor)";
    const sessionScore = sessionResult?.score || 0;
    const sessionStreak = sessionResult?.peakStreak || 0;
    const sessionCategory = sessionResult?.category || "programming";

    const matchCategory = activeCategory === "all" ||
      sessionCategory === activeCategory ||
      (activeCategory === "programming" && sessionCategory.startsWith("programming_")) ||
      (activeCategory === "business" && sessionCategory.startsWith("business_")) ||
      (activeCategory === "english" && sessionCategory.startsWith("english_"));

    try {
      let query = supabase.from("leaderboard").select("id, nickname, score, streak, category");

      if (activeCategory !== "all") {
        if (activeCategory === "programming") {
          query = query.or("category.eq.programming,category.like.programming_%");
        } else if (activeCategory === "business") {
          query = query.or("category.eq.business,category.like.business_%");
        } else if (activeCategory === "english") {
          query = query.or("category.eq.english,category.like.english_%");
        } else {
          query = query.eq("category", activeCategory);
        }
      }

      // 8-second query timeout
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database connection timeout")), 8000)
      );

      const executeQuery = async () => {
        const result = await query.order("score", { ascending: false }).limit(10);
        const { data, error } = result;
        if (error) {
          throw error;
        }
        return data;
      };

      const data = await Promise.race([executeQuery(), timeoutPromise]);

      if (!data) {
        throw new Error("No data returned from database");
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
    } catch (err: unknown) {
      console.error("Load leaderboard failed:", err);

      const errMsg = err instanceof Error ? err.message : "Leaderboard unavailable";
      setError(errMsg);
      setBoard([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

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

      {/* Live Recent Activity Feed / Ticker */}
      {recentFeeds && recentFeeds.length > 0 && (
        <div className="w-full p-4 rounded bg-bgDark/80 border border-neonCyan/30 font-mono text-[11px] text-textMuted tracking-wider shadow-[0_0_12px_rgba(34,211,238,0.05)] mb-8 max-w-4xl">
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
      )}

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
            <div className="flex flex-col items-center justify-center py-10 gap-3 relative">
              <SystemLogLoader context="leaderboard" />

              {/* CSS-based SSR/Hydration timeout fallback */}
              <div className="ssr-timeout-fallback flex flex-col items-center justify-center text-center px-4 rounded max-w-md mx-auto border border-red-500/30 bg-red-950/20">
                <span className="text-xs font-mono tracking-widest text-[#ef4444] uppercase font-black animate-pulse mb-2">
                  ⚠️ CONNECTION TIMEOUT // HYDRATION VECTOR FAILURE
                </span>
                <p className="text-[11px] text-textMuted font-mono leading-relaxed max-w-sm">
                  The client-side connection took too long to synchronize or JS hydration failed.
                  Please check your internet connection or ensure your browser supports JavaScript.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-3 py-1.5 border border-red-500/40 hover:border-red-500 bg-red-500/10 text-red-400 rounded text-[10px] font-display tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)] cursor-pointer"
                >
                  FORCE SYSTEM REBOOT
                </button>
              </div>

              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes showAfterTimeout {
                  0%, 99% {
                    opacity: 0;
                    visibility: hidden;
                    height: 0;
                    margin-top: 0;
                    padding: 0;
                    border-width: 0;
                  }
                  100% {
                    opacity: 1;
                    visibility: visible;
                    height: auto;
                    margin-top: 1rem;
                    padding: 1.5rem 1rem;
                    border-width: 1px;
                  }
                }
                .ssr-timeout-fallback {
                  animation: showAfterTimeout 0.01s linear 8s forwards;
                  opacity: 0;
                  visibility: hidden;
                  height: 0;
                  overflow: hidden;
                  margin-top: 0;
                  padding: 0;
                  border-width: 0;
                }
              `}} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-4">
              <span className="text-sm font-mono tracking-widest text-[#ef4444] uppercase font-bold animate-pulse">
                ⚠️ ERROR: LEADERBOARD UNAVAILABLE
              </span>
              <p className="text-xs text-textMuted max-w-md font-mono normal-case">
                Failed to establish database connection. The mainframe records could not be retrieved.
              </p>
              <button
                onClick={() => loadLeaderboard()}
                className="px-4 py-2 border border-neonCyan/30 hover:border-neonCyan bg-neonCyan/10 text-neonCyan rounded text-xs font-display tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.3)] cursor-pointer"
              >
                RETRY CONNECTION
              </button>
            </div>
          ) : board.length === 0 ? (
            <div className="text-center py-20 px-4">
              <span className="text-xs tracking-widest text-textMuted uppercase font-semibold font-mono">
                No entries yet — be the first!
              </span>
            </div>
          ) : (
            board.map((entry, index) => {
              // Row Ranking Polish Colors (Esports gold, silver, bronze tones)
              let rankStyle = "text-neonViolet";
              let rowStyle = "hover:bg-neonViolet/5 text-textMuted hover:text-textPrimary";

              if (entry.highlight) {
                // Own submission active row remains highly highlighted in vibrant cyan
                rowStyle = "bg-neonCyan/10 border-l-4 border-neonCyan text-textPrimary shadow-[inset_0_0_12px_rgba(34,211,238,0.15)]";
                rankStyle = "text-neonCyan animate-pulse";
              } else if (entry.rank === "01") {
                rowStyle = "bg-yellow-500/5 hover:bg-yellow-500/10 border-l-4 border-yellow-500 text-textPrimary shadow-[inset_0_0_10px_rgba(234,179,8,0.05)]";
                rankStyle = "text-yellow-500 font-black drop-shadow-[0_0_4px_rgba(234,179,8,0.3)]";
              } else if (entry.rank === "02") {
                rowStyle = "bg-slate-400/5 hover:bg-slate-400/10 border-l-4 border-slate-400 text-textPrimary shadow-[inset_0_0_10px_rgba(148,163,184,0.05)]";
                rankStyle = "text-slate-400 font-black drop-shadow-[0_0_4px_rgba(148,163,184,0.3)]";
              } else if (entry.rank === "03") {
                rowStyle = "bg-amber-700/5 hover:bg-amber-700/10 border-l-4 border-amber-700 text-textPrimary shadow-[inset_0_0_10px_rgba(180,83,9,0.05)]";
                rankStyle = "text-amber-700 font-black drop-shadow-[0_0_4px_rgba(180,83,9,0.3)]";
              }

              return (
                <div
                  key={`${entry.nickname}-${index}`}
                  className={`grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm font-semibold transition-all duration-200 ${rowStyle}`}
                >
                  {/* Rank */}
                  <div className={`col-span-2 font-bold ${rankStyle}`}>
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
              );
            })
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

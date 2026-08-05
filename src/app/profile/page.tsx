"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  getCumulativeXP,
} from "../../lib/achievements";

interface LifetimeStats {
  totalQuizzesPlayed: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
  aiTwinWins: number;
  aiTwinLosses: number;
  aiTwinTies: number;
  categoryPlayCounts: Record<string, number>;
}

const formatCategoryDisplayName = (id: string): string => {
  if (id === "code_escape_room") return "Code Escape Room";
  if (id.startsWith("programming_")) {
    const parts = id.split("_");
    const lang = parts[1] || "";
    return `Programming: ${lang.toUpperCase()}`;
  }
  if (id.startsWith("business_")) {
    const parts = id.split("_");
    const sub = parts[1] || "";
    return `Business: ${sub.toUpperCase()}`;
  }
  if (id.startsWith("english_")) {
    const parts = id.split("_");
    const sub = parts[1] || "";
    return `English: ${sub.toUpperCase()}`;
  }
  return id.replace("-", " ").toUpperCase();
};

import { useMemo } from "react";

import { supabase } from "../../../lib/supabase";

interface CategoryRank {
  category: string;
  rank: number;
}

export default function ProfilePage() {
  const [cumulativeXP, setCumulativeXP] = useState<number>(0);
  const [unlockedCount, setUnlockedCount] = useState<number>(0);
  const [nickname, setNickname] = useState<string | null>(null);
  const [ranks, setRanks] = useState<CategoryRank[]>([]);
  const [loadingRanks, setLoadingRanks] = useState<boolean>(false);
  const [stats, setStats] = useState<LifetimeStats>({
    totalQuizzesPlayed: 0,
    totalCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
    aiTwinWins: 0,
    aiTwinLosses: 0,
    aiTwinTies: 0,
    categoryPlayCounts: {},
  });

  useEffect(() => {
    setCumulativeXP(getCumulativeXP());
    setUnlockedCount(getUnlockedAchievements().length);

    try {
      const statsStr = localStorage.getItem("impossible_quiz_player_stats");
      if (statsStr) {
        setStats(JSON.parse(statsStr));
      }

      const nick = localStorage.getItem("impossible_quiz_nickname");
      setNickname(nick);

      if (nick) {
        setLoadingRanks(true);
        // Query Supabase to find best ranks for each category
        const queryRanks = async () => {
          try {
            const { data, error } = await supabase
              .from("leaderboard")
              .select("nickname, score, category")
              .order("score", { ascending: false });

            if (!error && data) {
              // Group and rank records per category
              const groups: Record<string, typeof data> = {};
              data.forEach((row) => {
                const cat = row.category;
                if (!groups[cat]) {
                  groups[cat] = [];
                }
                groups[cat].push(row);
              });

              const matchedRanks: CategoryRank[] = [];

              for (const [cat, rows] of Object.entries(groups)) {
                // Find matching user row index
                const userIdx = rows.findIndex(
                  (r) => r.nickname && r.nickname.trim().toUpperCase() === nick.trim().toUpperCase()
                );
                if (userIdx !== -1) {
                  matchedRanks.push({
                    category: cat,
                    rank: userIdx + 1,
                  });
                }
              }

              setRanks(matchedRanks);
            }
          } catch (err) {
            console.error("Failed to query user ranks:", err);
          } finally {
            setLoadingRanks(false);
          }
        };

        queryRanks();
      }
    } catch (e) {
      console.error("Failed to parse player stats:", e);
    }
  }, []);

  // Leveling Formula: Level = Math.floor(Math.sqrt(XP / 50)) + 1
  const level = Math.floor(Math.sqrt(cumulativeXP / 50)) + 1;

  // Calculate XP threshold for current and next levels
  const currentLevelMinXp = Math.pow(level - 1, 2) * 50;
  const nextLevelMinXp = Math.pow(level, 2) * 50;
  const levelProgressXp = cumulativeXP - currentLevelMinXp;
  const levelRangeXp = nextLevelMinXp - currentLevelMinXp;
  const levelPercentage = levelRangeXp > 0 ? Math.min(Math.round((levelProgressXp / levelRangeXp) * 100), 100) : 100;

  // Determine best/most played category
  const bestCategory = useMemo(() => {
    const counts = stats.categoryPlayCounts;
    if (!counts || Object.keys(counts).length === 0) return "NONE REGISTERED";
    let maxCount = 0;
    let bestId = "NONE REGISTERED";
    for (const [key, val] of Object.entries(counts)) {
      if (val > maxCount) {
        maxCount = val;
        bestId = key;
      }
    }
    return formatCategoryDisplayName(bestId);
  }, [stats.categoryPlayCounts]);

  // Overall accuracy
  const lifetimeAccuracy = stats.totalQuestionsAnswered > 0
    ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
    : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 max-w-4xl mx-auto w-full select-none relative overflow-hidden animate-page-fade">
      {/* Visual Glitch / Atmospheric Background */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline-slow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .profile-scanlines::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
          z-index: 20;
          background-size: 100% 4px;
          pointer-events: none;
        }
      `}} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center profile-scanlines">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-neonViolet/5 to-neonCyan/5 blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-neonCyan/10 animate-[scanline-slow_12s_linear_infinite]"></div>
      </div>

      {/* Title Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/30 px-4 py-1.5 rounded-full text-xs font-semibold font-display tracking-widest text-neonCyan uppercase">
        {"IQ_OS // CUSTOM_PROFILE_TELEMETRY"}
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-3 text-center uppercase">
        PLAYER{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonViolet drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          TELEMETRY
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-10 leading-relaxed font-mono text-xs">
        &gt; decrypting secure sandbox statistics... status: loaded
      </p>

      {/* Main Core Profile Panel */}
      <div className="w-full bg-bgDark/80 border-2 border-neonViolet/30 p-6 md:p-8 rounded-lg relative overflow-hidden mb-8 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neonCyan"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neonCyan"></div>

        {/* Level & XP progression indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-neonViolet/10 mb-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-lg bg-neonCyan/10 border border-neonCyan/30 flex flex-col items-center justify-center font-display shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="text-[9px] text-neonCyan font-bold uppercase tracking-widest leading-none mb-1">LVL</span>
              <span className="text-2xl font-black text-neonCyan leading-none">{cumulativeXP > 0 ? level : "-"}</span>
            </div>
            <div>
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-textPrimary">
                SYSTEM AGENT
              </h3>
              <p className="text-xs text-textMuted font-mono">
                {cumulativeXP > 0 ? (
                  `XP CLEARANCE: ${cumulativeXP.toLocaleString()} / ${nextLevelMinXp.toLocaleString()} PTS`
                ) : (
                  "Initialize First Infiltration to Decrypt XP"
                )}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48 text-right">
            <span className="text-[9px] font-mono tracking-widest text-textMuted block uppercase mb-1">
              LEVEL PROGRESSION // {cumulativeXP > 0 ? `${levelPercentage}%` : "INACTIVE"}
            </span>
            <div className="w-full h-2 bg-black/60 border border-neonCyan/20 rounded-full overflow-hidden">
              <div
                style={{ width: `${cumulativeXP > 0 ? levelPercentage : 0}%` }}
                className="h-full bg-gradient-to-r from-neonCyan to-neonViolet"
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Grid Matrix with Motivating CTAs for empty values */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-4 rounded border border-neonViolet/15 bg-bgDark/40 flex flex-col justify-center min-h-[100px]">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-1">QUIZZES PLAYED</span>
            {stats.totalQuizzesPlayed > 0 ? (
              <span className="text-xl font-bold text-textPrimary">{stats.totalQuizzesPlayed}</span>
            ) : (
              <span className="text-[10px] text-neonCyan font-bold uppercase leading-relaxed">Grid Simulation Offline // Initiate Session</span>
            )}
          </div>
          <div className="p-4 rounded border border-neonViolet/15 bg-bgDark/40 flex flex-col justify-center min-h-[100px]">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-1">ANSWERS COMMITTED</span>
            {stats.totalQuestionsAnswered > 0 ? (
              <span className="text-xl font-bold text-neonCyan">{stats.totalCorrectAnswers} / {stats.totalQuestionsAnswered}</span>
            ) : (
              <span className="text-[10px] text-neonViolet font-bold uppercase leading-relaxed">Complete Your First Mission to Earn XP</span>
            )}
          </div>
          <div className="p-4 rounded border border-neonViolet/15 bg-bgDark/40 flex flex-col justify-center min-h-[100px]">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-1">LIFETIME ACCURACY</span>
            {stats.totalQuestionsAnswered > 0 ? (
              <span className="text-xl font-bold text-neonViolet">{lifetimeAccuracy}%</span>
            ) : (
              <span className="text-[10px] text-textMuted font-bold uppercase leading-relaxed">Awaiting Calibration Telemetry</span>
            )}
          </div>
          <div className="p-4 rounded border border-neonViolet/15 bg-bgDark/40 flex flex-col justify-center min-h-[100px]">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-1">UNLOCKED BADGES</span>
            {unlockedCount > 0 ? (
              <span className="text-xl font-bold text-neonCyan">{unlockedCount} / {ACHIEVEMENTS.length}</span>
            ) : (
              <span className="text-[10px] text-neonCyan font-bold uppercase leading-relaxed">No Cryptographic Credentials Secured // Clear Challenges</span>
            )}
          </div>
        </div>

        {/* Head-to-Head AI record & Best Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t border-neonViolet/10 pt-6 text-left font-mono">
          {/* AI Twin Record */}
          <div className="p-4 rounded border border-neonViolet/10 bg-bgDark/30">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-2">AI TWIN DIRECT MATCHUPS</span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-textMuted">WINS // LOSSES // TIES:</span>
              <span className="font-bold text-neonCyan">
                {stats.aiTwinWins}W / {stats.aiTwinLosses}L / {stats.aiTwinTies}T
              </span>
            </div>
            <div className="w-full h-1 bg-black/60 rounded-full mt-2 overflow-hidden flex">
              <div
                style={{ width: `${stats.aiTwinWins + stats.aiTwinLosses + stats.aiTwinTies > 0 ? (stats.aiTwinWins / (stats.aiTwinWins + stats.aiTwinLosses + stats.aiTwinTies)) * 100 : 0}%` }}
                className="h-full bg-neonCyan"
              ></div>
              <div
                style={{ width: `${stats.aiTwinWins + stats.aiTwinLosses + stats.aiTwinTies > 0 ? (stats.aiTwinLosses / (stats.aiTwinWins + stats.aiTwinLosses + stats.aiTwinTies)) * 100 : 0}%` }}
                className="h-full bg-red-500"
              ></div>
              <div
                style={{ width: `${stats.aiTwinWins + stats.aiTwinLosses + stats.aiTwinTies > 0 ? (stats.aiTwinTies / (stats.aiTwinWins + stats.aiTwinLosses + stats.aiTwinTies)) * 100 : 0}%` }}
                className="h-full bg-textMuted"
              ></div>
            </div>
          </div>

          {/* Best Sector */}
          <div className="p-4 rounded border border-neonViolet/10 bg-bgDark/30">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-2">FAVORITE MAIN SECTOR</span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-textMuted">SECTOR IDENTIFIER:</span>
              <span className="font-bold text-neonViolet uppercase tracking-wider">
                {bestCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Leaderboard matching rankings (Part A) */}
        {nickname && (
          <div className="mt-6 border-t border-neonViolet/10 pt-6 text-left font-mono">
            <div className="p-4 rounded border border-neonCyan/20 bg-bgDark/40">
              <span className="text-[10px] tracking-widest text-neonCyan block uppercase font-bold mb-3">
                📡 GLOBAL HALL OF CHAMPIONS TELEMETRY // MATCHED Ranks:
              </span>
              <div className="flex flex-col gap-1 text-xs">
                <div className="text-textMuted mb-2">
                  ACTOR PROFILE IDENTIFIER: <span className="text-neonCyan font-bold uppercase">{nickname}</span>
                </div>
                {loadingRanks ? (
                  <div className="text-textMuted animate-pulse text-[11px]">&gt; Querying mainframe databanks...</div>
                ) : ranks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {ranks.map((r, i) => (
                      <div key={i} className="flex justify-between items-center bg-bgDark border border-neonViolet/10 p-2 rounded">
                        <span className="text-textMuted truncate mr-2">{formatCategoryDisplayName(r.category)}</span>
                        <Link href="/leaderboard" className="text-neonCyan font-bold hover:underline shrink-0">
                          Rank #{r.rank}
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-textMuted text-[11px]">
                    &gt; No leaderboard placements detected for this handle yet. Submit a score on the results screen to record your rank.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Nav buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center font-display">
        <Link
          href="/achievements"
          className="w-full sm:w-auto text-center px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded border border-neonViolet/40 hover:border-neonViolet bg-bgDark hover:bg-neonViolet/5 text-textPrimary hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] focus:outline-none"
        >
          VIEW DETAILED BADGES 🏆
        </Link>
        <Link
          href="/categories"
          className="w-full sm:w-auto text-center px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded bg-neonCyan text-bgDark hover:bg-neonCyan/90 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none"
        >
          LAUNCH SIMULATION
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto text-center px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded border border-textMuted bg-transparent hover:bg-textMuted/5 text-textMuted hover:text-textPrimary"
        >
          SYSTEM HEADQUARTERS
        </Link>
      </div>
    </div>
  );
}

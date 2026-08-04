"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  getCumulativeXP,
  POLYGLOT_LANGUAGES_KEY,
} from "../../lib/achievements";

export default function AchievementsPage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [cumulativeXP, setCumulativeXP] = useState<number>(0);
  const [playedLanguages, setPlayedLanguages] = useState<string[]>([]);

  useEffect(() => {
    setUnlockedIds(getUnlockedAchievements());
    setCumulativeXP(getCumulativeXP());

    try {
      const langs = localStorage.getItem(POLYGLOT_LANGUAGES_KEY);
      if (langs) {
        setPlayedLanguages(JSON.parse(langs));
      }
    } catch (e) {
      console.error("Failed to parse polyglot played languages:", e);
    }
  }, []);

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = unlockedIds.length;
  const completionPercentage =
    totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 max-w-4xl mx-auto w-full select-none relative overflow-hidden animate-page-fade">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
        <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-neonViolet/5 to-neonCyan/5 blur-3xl"></div>
      </div>

      {/* Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonViolet/10 border border-neonViolet/30 px-4 py-1.5 rounded-full text-xs font-semibold font-display tracking-widest text-neonViolet uppercase">
        {"SYSTEM_ARCHIVE // ACHIEVEMENT_RECORD"}
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-3 text-center uppercase">
        SYSTEM{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          ACHIEVEMENTS
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-10 leading-relaxed">
        Verify your personal cryptographic achievements and cumulative XP clearance logs below.
      </p>

      {/* XP & Progress Metrics Bar */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 border border-neonViolet/20 bg-bgDark/60 p-6 rounded-lg font-mono text-center mb-10 select-none">
        <div>
          <span className="text-[10px] tracking-widest text-textMuted block uppercase mb-1">CUMULATIVE XP</span>
          <span className="text-2xl font-black text-neonCyan drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]">
            {cumulativeXP.toLocaleString()} XP
          </span>
        </div>

        <div>
          <span className="text-[10px] tracking-widest text-textMuted block uppercase mb-1">DECRYPTED BADGES</span>
          <span className="text-2xl font-black text-neonViolet drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]">
            {unlockedCount} / {totalAchievements}
          </span>
        </div>

        <div>
          <span className="text-[10px] tracking-widest text-textMuted block uppercase mb-1">SYSTEM SYNC RATE</span>
          <span className="text-2xl font-black text-neonCyan">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Visual Line */}
      <div className="w-full h-1.5 bg-bgDark border border-neonViolet/20 rounded-full mb-10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neonCyan to-neonViolet transition-all duration-1000"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      {/* Grid List of Achievements */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {ACHIEVEMENTS.map((item) => {
          const isUnlocked = unlockedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-lg border transition-all duration-300 relative overflow-hidden flex gap-4 items-start ${
                isUnlocked
                  ? "bg-bgDark border-neonCyan/40 shadow-[0_0_12px_rgba(34,211,238,0.1)]"
                  : "bg-bgDark/30 border-neonViolet/10 opacity-50"
              }`}
            >
              {/* Glow accent for unlocked badges */}
              {isUnlocked && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-neonCyan"></div>
              )}

              {/* Icon Container */}
              <div
                className={`w-12 h-12 shrink-0 rounded flex items-center justify-center text-2xl border transition-all duration-300 ${
                  isUnlocked
                    ? "bg-neonCyan/10 border-neonCyan/30 text-textPrimary shadow-[0_0_8px_rgba(34,211,238,0.2)] animate-pulse"
                    : "bg-bgDark border-neonViolet/10 text-textMuted"
                }`}
              >
                {isUnlocked ? item.icon : "🔒"}
              </div>

              {/* Badge Details */}
              <div className="flex-1 text-left font-mono">
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-sm font-bold tracking-wider font-display uppercase ${
                      isUnlocked ? "text-textPrimary" : "text-textMuted"
                    }`}
                  >
                    {item.title}
                  </h3>
                  {isUnlocked && (
                    <span className="text-[8px] font-bold text-neonCyan uppercase tracking-widest bg-neonCyan/10 border border-neonCyan/20 px-1 py-0.2 rounded animate-pulse">
                      SECURED
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-textMuted leading-relaxed mt-1">
                  {item.description}
                </p>

                {/* Additional context metrics helper */}
                {item.id === "polyglot" && playedLanguages.length > 0 && (
                  <div className="text-[9px] text-neonViolet/70 uppercase mt-2 font-black">
                    LANGUAGES PLAYED: {playedLanguages.join(", ")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons Action Group */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center font-display">
        {/* Play Now */}
        <Link
          href="/categories"
          className="w-full sm:w-auto text-center px-10 py-4 text-base font-black tracking-widest uppercase transition-all duration-300 rounded bg-neonCyan text-bgDark hover:bg-neonCyan/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] focus:outline-none focus:ring-2 focus:ring-neonCyan"
        >
          ENTER THE QUIZ
        </Link>

        {/* Back Home */}
        <Link
          href="/"
          className="w-full sm:w-auto text-center px-10 py-4 text-base font-bold tracking-widest uppercase transition-all duration-300 rounded border-2 border-neonViolet text-textPrimary hover:bg-neonViolet/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] focus:outline-none focus:ring-2 focus:ring-neonViolet"
        >
          RETURN HOME
        </Link>
      </div>
    </div>
  );
}

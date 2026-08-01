"use client";

import { useState } from "react";
import Link from "next/link";
import AITwinToggle from "../../components/AITwinToggle";
import { categories } from "../../lib/categories";

export default function CategoriesPage() {
  const [aiTwin, setAiTwin] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-6xl mx-auto w-full select-none">
      {/* Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-neonCyan uppercase font-display">
        SELECT_SECTOR // 01
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-3 text-center uppercase">
        CHOOSE YOUR{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
          BATTLEGROUND
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-10">
        Each sector demands extreme competence. Once entered, the simulation begins immediately. Choose wisely.
      </p>

      {/* AI Twin Toggle Component */}
      <AITwinToggle enabled={aiTwin} onChange={setAiTwin} />

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-6">
        {categories.map((cat) => {
          const finalHref = cat.href + (cat.href.includes("?") ? "&" : "?") + `aiTwin=${aiTwin}`;
          return (
            <Link
              key={cat.id}
              href={finalHref}
              aria-label={`Enter sector: ${cat.title}. Description: ${cat.desc}`}
              className="group relative flex flex-col justify-between p-6 rounded-lg bg-bgDark border-2 border-neonViolet/20 hover:border-neonCyan transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:-translate-y-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-neonCyan"
            >
              {/* Background absolute subtle neon line */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>

              <div>
                {/* Category Header */}
                <div className="flex justify-between items-start mb-4">
                  <span>{cat.icon}</span>
                  <span className="text-xs font-display tracking-widest text-neonCyan bg-neonCyan/10 border border-neonCyan/25 px-2.5 py-0.5 rounded">
                    {cat.tag}
                  </span>
                </div>

                {/* Category Title with optional Chevron for Expandable ones */}
                <h3 className="text-xl font-bold font-display tracking-wide text-textPrimary group-hover:text-neonCyan transition-colors duration-300 mb-2 uppercase flex items-center gap-1.5">
                  {cat.title}
                  {cat.isExpandable && <span className="text-neonCyan group-hover:text-neonViolet transition-colors duration-300 text-lg">→</span>}
                </h3>

                {/* Description */}
                <p className="text-sm text-textMuted leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Simulated Action */}
              <div className="mt-6 flex items-center justify-end text-xs font-bold font-display tracking-wider text-neonViolet group-hover:text-neonCyan transition-colors duration-300 uppercase">
                {cat.actionLabel}
              </div>
            </Link>
          );
        })}
      </div>

      {/* 5. HARDCORE MODE: ESCAPE ROOM */}
      <div className="w-full mb-12">
        <Link
          href="/escape-room"
          aria-label="Enter Sector: Code Escape Room. Description: 8 linear firewalled rooms under an overall 5-minute countdown."
          className="group relative flex flex-col md:flex-row justify-between items-center p-6 rounded-lg bg-bgDark border-2 border-red-500/20 hover:border-red-500 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.03)] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 w-full gap-6 text-left"
        >
          {/* Background absolute subtle neon line */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-3">
              <span
                style={{ color: "#ef4444" }}
                className="flex items-center gap-1.5 font-bold font-display text-[10px] tracking-widest uppercase"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                CRITICAL INFILTRATION VECTOR
              </span>
              <span
                style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.25)", backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                className="text-xs font-display tracking-widest border px-2.5 py-0.5 rounded"
              >
                HARDCORE.SEC
              </span>
            </div>

            <h3 className="text-xl font-bold font-display tracking-wide text-textPrimary group-hover:text-red-500 transition-colors duration-300 mb-2 uppercase">
              CODE ESCAPE ROOM // CORRUPTED SYSTEM
            </h3>

            <p className="text-sm text-textMuted leading-relaxed max-w-3xl">
              A standalone linear infiltration sequence. Traverse exactly 8 firewalled narrative chambers of increasing difficulty. Bypass locks under a shared 5-minute countdown clock. Maximum of 3 room failures allowed before permanent lockout.
            </p>
          </div>

          <div
            style={{ color: "#ef4444" }}
            className="w-full md:w-auto shrink-0 flex items-center justify-end text-xs font-bold font-display tracking-wider group-hover:text-red-400 transition-colors duration-300 uppercase"
          >
            LAUNCH OVERRIDE PROTOCOL →
          </div>
        </Link>
      </div>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="text-xs font-display tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5 focus:outline-none focus:ring-1 focus:ring-neonViolet"
      >
        ← ABANDON MISSION (HOME)
      </Link>
    </div>
  );
}

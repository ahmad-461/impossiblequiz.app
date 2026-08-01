import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const KNOWN_CATEGORIES = [
  "programming",
  "logic-algorithms",
  "data-analytics",
  "computer-science-fundamentals",
];

const KNOWN_OUTCOMES = ["boss_victory", "pool_victory", "boss_defeat", "defeat"];

const formatCategoryName = (id: string): string => {
  if (id.startsWith("programming_")) {
    const parts = id.split("_");
    const langRaw = parts[1] || "";
    const diffRaw = parts[2] || "";

    const langMapping: Record<string, string> = {
      python: "Python",
      java: "Java",
      javascript: "JavaScript",
      c: "C",
      cpp: "C++",
      csharp: "C#",
      php: "PHP",
      typescript: "TypeScript",
      go: "Go",
      rust: "Rust",
      kotlin: "Kotlin",
      swift: "Swift",
    };

    const formattedLang = langMapping[langRaw.toLowerCase()] || langRaw.toUpperCase();
    const formattedDiff = diffRaw.charAt(0).toUpperCase() + diffRaw.slice(1);

    return `Programming: ${formattedLang} (${formattedDiff})`;
  }

  const categoryLabels: Record<string, string> = {
    programming: "Programming // SYS.LANG",
    "logic-algorithms": "Logic/Algorithms // ALG.COMP",
    "data-analytics": "Data Analytics // DAT.SCALE",
    "computer-science-fundamentals": "CS Fundamentals // SYS.CORE",
  };
  return categoryLabels[id] || id.toUpperCase();
};

// Fetch helper with strict timeout
async function fetchFont(url: string, timeoutMs: number): Promise<ArrayBuffer | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      return await res.arrayBuffer();
    }
  } catch (e) {
    console.warn(`Failed to fetch font from ${url}:`, e);
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // 1. Sanitize & validate parameters
  const rawScore = searchParams.get("score") || "0";
  let scoreNum = parseInt(rawScore, 10);
  if (isNaN(scoreNum) || scoreNum < 0) scoreNum = 0;
  if (scoreNum > 1000000) scoreNum = 1000000; // reasonable cap
  const scoreFormatted = scoreNum.toLocaleString();

  const rawStreak = searchParams.get("streak") || "0";
  let streakNum = parseInt(rawStreak, 10);
  if (isNaN(streakNum) || streakNum < 0) streakNum = 0;
  if (streakNum > 100) streakNum = 100; // reasonable cap

  let category = searchParams.get("category") || "programming";
  if (!KNOWN_CATEGORIES.includes(category) && !category.startsWith("programming_")) {
    category = "programming";
  }

  let outcome = searchParams.get("outcome") || "defeat";
  if (!KNOWN_OUTCOMES.includes(outcome)) {
    outcome = "defeat";
  }

  // 2. Map visual labels
  const categoryLabel = formatCategoryName(category);

  let outcomeLabel = "GAME OVER";
  let outcomeColor = "#a855f7"; // neonViolet
  let outcomeBg = "rgba(168, 85, 247, 0.15)";
  let outcomeBorder = "#a855f7";

  if (outcome === "boss_victory") {
    outcomeLabel = "🏆 BOSS DEFEATED";
    outcomeColor = "#22d3ee"; // neonCyan
    outcomeBg = "rgba(34, 211, 238, 0.15)";
    outcomeBorder = "#22d3ee";
  } else if (outcome === "pool_victory") {
    outcomeLabel = "🏆 POOL CLEARED";
    outcomeColor = "#22d3ee";
    outcomeBg = "rgba(34, 211, 238, 0.15)";
    outcomeBorder = "#22d3ee";
  } else if (outcome === "boss_defeat") {
    outcomeLabel = "⚠️ SO CLOSE (BOSS ROUND)";
    outcomeColor = "#a855f7";
    outcomeBg = "rgba(168, 85, 247, 0.15)";
    outcomeBorder = "#a855f7";
  }

  // 3. Fetch fonts dynamically with a strict 2-second timeout
  const orbitronData = await fetchFont(
    "https://fonts.gstatic.com/s/orbitron/v35/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1ny_Cmxpg.ttf",
    2000
  );
  const interRegularData = await fetchFont(
    "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
    2000
  );
  const interBoldData = await fetchFont(
    "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf",
    2000
  );

  type FontStyle = "normal" | "italic";
  type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

  interface FontConfig {
    name: string;
    data: ArrayBuffer;
    weight?: FontWeight;
    style?: FontStyle;
  }

  const fontsConfig: FontConfig[] = [];
  if (orbitronData) {
    fontsConfig.push({
      name: "Orbitron",
      data: orbitronData,
      weight: 700,
      style: "normal",
    });
  }
  if (interRegularData) {
    fontsConfig.push({
      name: "Inter",
      data: interRegularData,
      weight: 400,
      style: "normal",
    });
  }
  if (interBoldData) {
    fontsConfig.push({
      name: "Inter",
      data: interBoldData,
      weight: 700,
      style: "normal",
    });
  }

  // 4. Render Open Graph Image Response
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0b10",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          fontFamily: orbitronData ? "Orbitron, sans-serif" : "sans-serif",
        }}
      >
        {/* Glowing Container Card */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#0a0b10",
            border: "3px solid #a855f7",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px",
            position: "relative",
            boxShadow: "0 0 40px rgba(168, 85, 247, 0.3)",
          }}
        >
          {/* Top cyan glow corners decoration */}
          <div
            style={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
              width: "40px",
              height: "40px",
              borderTop: "6px solid #22d3ee",
              borderRight: "6px solid #22d3ee",
              borderTopRightRadius: "16px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-3px",
              left: "-3px",
              width: "40px",
              height: "40px",
              borderBottom: "6px solid #22d3ee",
              borderLeft: "6px solid #22d3ee",
              borderBottomLeftRadius: "16px",
            }}
          />

          {/* Card Top Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(168, 85, 247, 0.25)",
              paddingBottom: "20px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "12px",
                  letterSpacing: "4px",
                  color: "#9ca3af",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontFamily: interRegularData ? "Inter, sans-serif" : "sans-serif",
                }}
              >
                SURVIVOR MAINFRAME
              </span>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "#a855f7",
                  letterSpacing: "2px",
                  marginTop: "4px",
                }}
              >
                IMPOSSIBLE QUIZ GENERATOR
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  letterSpacing: "3px",
                  color: "#9ca3af",
                  fontWeight: 700,
                  fontFamily: interRegularData ? "Inter, sans-serif" : "sans-serif",
                }}
              >
                SYSTEM CLEARANCE
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#22d3ee",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  marginTop: "4px",
                }}
              >
                SECURE REPORT
              </span>
            </div>
          </div>

          {/* Card Center Info (Final Score & Outcome Badge) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              margin: "30px 0",
            }}
          >
            {/* Left side: Prominent Score Display */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "14px",
                  letterSpacing: "4px",
                  color: "#9ca3af",
                  fontWeight: 700,
                  fontFamily: interRegularData ? "Inter, sans-serif" : "sans-serif",
                }}
              >
                FINAL SCORE
              </span>
              <span
                style={{
                  fontSize: "80px",
                  fontWeight: 900,
                  color: "#22d3ee",
                  letterSpacing: "-1px",
                  lineHeight: 1,
                  marginTop: "8px",
                  textShadow: "0 0 20px rgba(34, 211, 238, 0.4)",
                }}
              >
                {scoreFormatted}
              </span>
            </div>

            {/* Right side: Glowing Outcome Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: outcomeBg,
                border: `2px solid ${outcomeBorder}`,
                borderRadius: "12px",
                padding: "24px 36px",
                boxShadow: `0 0 25px rgba(${outcome === "boss_victory" || outcome === "pool_victory" ? "34, 211, 238" : "168, 85, 247"}, 0.25)`,
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: outcomeColor,
                  letterSpacing: "4px",
                  textAlign: "center",
                }}
              >
                {outcomeLabel}
              </span>
            </div>
          </div>

          {/* Card Bottom Footer Metrics */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(168, 85, 247, 0.25)",
              paddingTop: "24px",
              width: "100%",
            }}
          >
            {/* Category badge */}
            <div
              style={{
                display: "flex",
                border: "1px solid rgba(34, 211, 238, 0.3)",
                backgroundColor: "rgba(34, 211, 238, 0.05)",
                padding: "8px 16px",
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "#22d3ee",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  fontFamily: interRegularData ? "Inter, sans-serif" : "sans-serif",
                }}
              >
                SECTOR: {categoryLabel}
              </span>
            </div>

            {/* Peak streak badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  color: "#9ca3af",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  marginRight: "8px",
                  fontFamily: interRegularData ? "Inter, sans-serif" : "sans-serif",
                }}
              >
                PEAK STREAK:
              </span>
              <span
                style={{
                  fontSize: "20px",
                  color: "#a855f7",
                  fontWeight: 900,
                  letterSpacing: "1px",
                }}
              >
                {streakNum} 🔥
              </span>
            </div>

            {/* Watermark security label */}
            <div
              style={{
                fontSize: "10px",
                color: "rgba(168, 85, 247, 0.4)",
                letterSpacing: "3px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              CLEARANCE SECURE // TERM_DATA
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontsConfig,
    }
  );
}

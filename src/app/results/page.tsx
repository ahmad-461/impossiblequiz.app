import { Suspense } from "react";
import { Metadata } from "next";
import ResultsClient from "./ResultsClient";
import SystemLogLoader from "../../components/SystemLogLoader";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const KNOWN_CATEGORIES = [
  "programming",
  "logic-algorithms",
  "data-analytics",
  "computer-science-fundamentals",
];

const KNOWN_OUTCOMES = ["boss_victory", "pool_victory", "boss_defeat", "defeat"];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;

  // Sanitize score
  let scoreNum = parseInt(String(params.score || "0"), 10);
  if (isNaN(scoreNum) || scoreNum < 0) scoreNum = 0;
  if (scoreNum > 1000000) scoreNum = 1000000;

  // Sanitize streak
  let streakNum = parseInt(String(params.streak || "0"), 10);
  if (isNaN(streakNum) || streakNum < 0) streakNum = 0;
  if (streakNum > 100) streakNum = 100;

  // Sanitize category
  let categoryStr = String(params.category || "programming");
  if (!KNOWN_CATEGORIES.includes(categoryStr)) {
    categoryStr = "programming";
  }

  // Sanitize outcome
  let outcomeStr = String(params.outcome || "defeat");
  if (!KNOWN_OUTCOMES.includes(outcomeStr)) {
    outcomeStr = "defeat";
  }

  const categoryNames: Record<string, string> = {
    programming: "Programming",
    "logic-algorithms": "Logic/Algorithms",
    "data-analytics": "Data Analytics",
    "computer-science-fundamentals": "CS Fundamentals",
  };

  const outcomeLabels: Record<string, string> = {
    boss_victory: "Boss Defeated",
    pool_victory: "Pool Cleared",
    boss_defeat: "Game Over",
    defeat: "Game Over",
  };

  const scoreFormatted = scoreNum.toLocaleString();
  const categoryLabel = categoryNames[categoryStr] || categoryStr;
  const outcomeLabel = outcomeLabels[outcomeStr] || "Game Over";

  const ogUrl = `/api/og?score=${scoreNum}&streak=${streakNum}&category=${categoryStr}&outcome=${outcomeStr}`;

  return {
    title: `Clearance Report: ${scoreFormatted} [${outcomeLabel}] — Impossible Quiz`,
    description: `Cleared the ${categoryLabel} sector of the Impossible Quiz mainframe with a final score of ${scoreFormatted} and a peak streak of ${streakNum}!`,
    openGraph: {
      title: `Impossible Quiz Survivor Clearance [${outcomeLabel}]`,
      description: `Sector: ${categoryLabel} | Final Score: ${scoreFormatted} | Streak: ${streakNum} 🔥`,
      type: "website",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `Impossible Quiz clearance report for ${categoryLabel}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Impossible Quiz Survivor Clearance [${outcomeLabel}]`,
      description: `Sector: ${categoryLabel} | Final Score: ${scoreFormatted} | Streak: ${streakNum} 🔥`,
      images: [ogUrl],
    },
  };
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <SystemLogLoader context="results" />
      </div>
    }>
      <ResultsClient />
    </Suspense>
  );
}

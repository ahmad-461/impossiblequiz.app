import { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "Mainframe Hall of Champions — The Impossible Quiz",
  description: "View top anonymous survival records from our real-time global leaderboard. See who bypassed the ultimate impossible difficulty and claims victory in the mainframe.",
  keywords: ["impossible quiz leaderboard", "trivia rankings", "esports trivia scoreboard", "programming champions"],
  authors: [{ name: "Muhammad Ahmad Khan" }],
  openGraph: {
    title: "Mainframe Hall of Champions — The Impossible Quiz",
    description: "Compare your score against the top survivors of the Impossible Quiz. Secure your rank on the leaderboard.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mainframe Hall of Champions — The Impossible Quiz",
    description: "Compare your score against the top survivors of the Impossible Quiz. Secure your rank on the leaderboard.",
  },
};

export default function Page() {
  return <LeaderboardClient />;
}

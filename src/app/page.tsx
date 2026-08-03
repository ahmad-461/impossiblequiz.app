import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "The Impossible Quiz Generator — AI-Powered Trivia Mainframe",
  description: "Test your limits against the ultimate AI-generated impossible quiz. Dynamic difficulty, survival countdowns, and custom topics powered by Gemini and our python adaptive engine.",
  keywords: ["impossible quiz", "ai trivia", "gemini quiz", "quiz generator", "programming quiz", "adaptive difficulty"],
  authors: [{ name: "Muhammad Ahmad Khan" }],
  openGraph: {
    title: "The Impossible Quiz Generator — AI-Powered Trivia Mainframe",
    description: "Can you beat the AI-powered impossible quiz mainframe? Test your skills with real-time question generation and dynamic difficulty scaling.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Impossible Quiz Generator — AI-Powered Trivia Mainframe",
    description: "AI-generated quiz with dynamic difficulty scaling, boss rounds, and high-stakes survival.",
  },
};

export default function Page() {
  return <HomeClient />;
}

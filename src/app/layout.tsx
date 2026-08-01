import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "The Impossible Quiz Generator — AI-Powered Trivia Mainframe",
  description: "Test your limits against the ultimate AI-generated impossible quiz. Dynamic difficulty progression, boss rounds, and custom topics powered by Gemini and our python engine.",
  keywords: ["impossible quiz", "ai trivia", "gemini quiz", "quiz generator", "esports trivia", "programming quiz"],
  authors: [{ name: "Muhammad Ahmad Khan" }],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "The Impossible Quiz Generator",
    description: "Can you beat the AI-powered impossible quiz mainframe? Test your skills with real-time question generation and dynamic difficulty scaling.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Impossible Quiz Generator",
    description: "AI-generated quiz with dynamic difficulty scaling, boss rounds, and high-stakes survival.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="font-sans bg-bgDark text-textPrimary min-h-screen flex flex-col">
        {/* Persistent Sticky Navigation Header */}
        <Header />

        {/* Main Content Area: padded top to clear the sticky header */}
        <main className="flex-1 flex flex-col pt-20">
          {children}
        </main>

        {/* Persistent Quiet Footer */}
        <Footer />
      </body>
    </html>
  );
}

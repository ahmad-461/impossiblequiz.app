import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Impossible Quiz Generator — AI-Powered Trivia Mainframe",
  description: "Test your limits against the ultimate AI-generated impossible quiz. Dynamic difficulty progression, boss rounds, and custom topics powered by Gemini and our python engine.",
  keywords: ["impossible quiz", "ai trivia", "gemini quiz", "quiz generator", "esports trivia", "programming quiz"],
  authors: [{ name: "Esports Quiz Team" }],
  icons: {
    icon: "/favicon.ico",
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
    <html lang="en">
      <body className={`${inter.className} bg-bgDark text-textPrimary min-h-screen flex flex-col`}>
        {/* Persistent minimalist esports header */}
        <header className="border-b border-neonViolet/20 bg-bgDark py-4 px-6 md:px-12 flex justify-between items-center shadow-[0_1px_10px_rgba(168,85,247,0.15)]">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-widest text-neonViolet drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              IMPOSSIBLE<span className="text-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">QUIZ</span>
            </span>
          </div>
          <div className="text-xs uppercase tracking-widest text-neonCyan border border-neonCyan/40 px-2.5 py-1 rounded-md font-mono bg-neonCyan/5 animate-pulse">
            PHASE 4 // STAGING
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}

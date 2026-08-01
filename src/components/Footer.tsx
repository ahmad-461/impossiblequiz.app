"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bgDark border-t border-neonViolet/40 shadow-[0_-4px_20px_rgba(168,85,247,0.18)] py-8 px-6 md:px-12 relative overflow-hidden select-none">
      {/* Absolute faint accent light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[80px] rounded-full bg-neonViolet/5 blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6">

        {/* Row 1: Wordmark/Tagline and Nav Links */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          {/* Left: Wordmark & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
            <Link href="/" className="flex items-center gap-2 group mb-3 focus:outline-none">
              <span className="text-lg font-black font-display tracking-widest text-neonViolet drop-shadow-[0_0_8px_rgba(168,85,247,0.4)] transition-all duration-300">
                IMPOSSIBLE<span className="text-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">QUIZ</span>
              </span>
            </Link>
            <p className="text-xs text-textMuted leading-relaxed">
              An AI-powered, adaptive-difficulty trivia mainframe testing the ultimate limits of developers and engineers.
            </p>
          </div>

          {/* Right: Nav Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs uppercase tracking-widest font-display font-bold md:mt-1">
            <Link href="/" className="text-textMuted hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-200">
              Home
            </Link>
            <Link href="/categories" className="text-textMuted hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-200">
              Categories
            </Link>
            <Link href="/leaderboard" className="text-textMuted hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-200">
              Leaderboard
            </Link>
            <Link href="/escape-room" className="text-textMuted hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-200">
              Escape Room
            </Link>
          </div>
        </div>

        {/* Separator Divider Line */}
        <div className="w-full h-[1px] bg-neonViolet/15"></div>

        {/* Row 2: Copyright and Attribution Link */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] tracking-wider font-display text-textMuted">
          {/* Left: Copyright */}
          <div className="opacity-60 text-center sm:text-left">
            &copy; {currentYear} {"// ALL RIGHTS RESERVED"}
          </div>

          {/* Right: Attribution Link */}
          <div className="text-center sm:text-right">
            Built by{" "}
            <a
              href="https://ahmad-khan-build-ship-iterate-xi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neonCyan font-bold hover:text-neonViolet hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.4)] transition-all duration-200"
            >
              Muhammad Ahmad Khan
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bgDark border-t border-neonViolet/20 py-10 px-6 md:px-12 relative overflow-hidden select-none">
      {/* Absolute faint accent light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[80px] rounded-full bg-neonViolet/5 blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12 relative z-10">

        {/* Left Section: Wordmark & Tagline */}
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

        {/* Center Section: Main Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest font-display font-bold">
          <Link href="/" className="text-textMuted hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-200">
            Home
          </Link>
          <Link href="/categories" className="text-textMuted hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-200">
            Categories
          </Link>
          <Link href="/leaderboard" className="text-textMuted hover:text-neonCyan hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.4)] transition-all duration-200">
            Leaderboard
          </Link>
        </div>

        {/* Right Section: Attribution & Copyright */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right font-display text-[10px] tracking-wider text-textMuted">
          <div>
            Built by{" "}
            <a
              href="https://portfolio-os.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neonCyan font-bold hover:text-neonViolet hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.4)] transition-all duration-200"
            >
              Muhammad Ahmad Khan
            </a>
          </div>
          <div className="mt-1 opacity-60">
            &copy; {currentYear} {"// ALL RIGHTS RESERVED"}
          </div>
        </div>

      </div>
    </footer>
  );
}

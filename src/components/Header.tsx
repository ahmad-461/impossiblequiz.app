"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initialize once
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
        scrolled
          ? "bg-bgDark/80 backdrop-blur-md border-b border-neonViolet/40 shadow-[0_4px_20px_rgba(168,85,247,0.18)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Brand / Logo + Wordmark */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          {/* Inline SVG matching icon.svg */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-200"
            fill="none"
          >
            <rect width="32" height="32" rx="6" fill="#0a0b10" />
            <rect width="30" height="30" x="1" y="1" rx="5" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.4" />
            {/* Stylized I */}
            <path d="M10 9h4M12 9v14M10 23h4" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Stylized Q */}
            <circle cx="21" cy="15" r="5" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23.5 17.5L26 21" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <span className="text-xl md:text-2xl font-black font-display tracking-widest text-neonViolet drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] group-hover:text-neonCyan group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-300">
            IMPOSSIBLE<span className="text-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:text-neonViolet group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">QUIZ</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.filter(link => link.href !== "/").map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-widest font-display font-bold transition-all duration-200 relative py-1 focus:outline-none focus:text-neonCyan ${
                  isActive
                    ? "text-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                    : "text-textMuted hover:text-textPrimary hover:drop-shadow-[0_0_6px_rgba(245,245,245,0.2)]"
                }`}
              >
                {link.label}
                {/* Active indicator bar */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-neonCyan transition-all duration-300 origin-left ${
                    isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          className="flex md:hidden flex-col items-center justify-center gap-1.5 w-8 h-8 border border-neonViolet/30 hover:border-neonCyan rounded bg-bgDark/40 text-textMuted hover:text-neonCyan focus:outline-none transition-colors duration-200"
          aria-label="Toggle Navigation Menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`w-4 h-0.5 bg-current transition-transform duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-4 h-0.5 bg-current transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-4 h-0.5 bg-current transition-transform duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown Slider */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 border-b border-neonViolet/30 bg-bgDark/95 backdrop-blur-lg overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-60 opacity-100 py-4 shadow-[0_10px_20px_rgba(168,85,247,0.15)]" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4 px-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-widest font-display font-bold py-2 border-b border-neonViolet/10 transition-colors duration-200 ${
                  isActive ? "text-neonCyan" : "text-textMuted hover:text-textPrimary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

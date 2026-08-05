"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isSoundEnabled, setSoundEnabled } from "../lib/sound";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setSoundOn(isSoundEnabled());

    const handleSoundToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSoundOn(customEvent.detail);
    };

    window.addEventListener("sound-toggle-updated", handleSoundToggle);
    return () => window.removeEventListener("sound-toggle-updated", handleSoundToggle);
  }, []);

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

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
  };

  const navLinks = [
    { href: "/", label: "cd /home" },
    { href: "/categories", label: "cd /categories" },
    { href: "/leaderboard", label: "cd /leaderboard" },
    { href: "/escape-room", label: "./escape-room" },
    { href: "/achievements", label: "cd /achievements" },
    { href: "/profile", label: "cd /profile" },
  ];

  return (
    <>
      <style>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .terminal-blink {
          animation: terminal-blink 1s step-end infinite;
        }
        .terminal-cmd {
          position: relative;
        }
        .terminal-cmd::after {
          content: '_';
          display: inline-block;
          opacity: 0;
          width: 0;
          overflow: hidden;
          transition: opacity 0.1s ease-in-out, width 0.1s ease-in-out;
        }
        .terminal-cmd:hover::after {
          opacity: 1;
          width: auto;
          animation: terminal-blink 1s step-end infinite;
          color: #22d3ee;
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
          scrolled
            ? "bg-bgDark/80 backdrop-blur-md border-b border-neonViolet/40 shadow-[0_4px_20px_rgba(168,85,247,0.18)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          {/* Brand / Logo + Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Impossible Quiz Mainframe - Home"
          >
            {/* Inline SVG matching icon.svg */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-300 ease-in-out flex-shrink-0"
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

            {/* Terminal Prefix styled brand lockup */}
            <div className="flex items-center font-mono text-xs sm:text-sm md:text-base tracking-wider select-none">
              <span className="text-neonViolet font-bold mr-1">[IQ-OS]</span>
              {!mounted ? (
                <span className="text-neonCyan">guest@impossiblequiz:~$</span>
              ) : (
                <>
                  <span className="text-neonCyan hidden sm:inline">guest@impossiblequiz:~$</span>
                  <span className="text-neonCyan inline sm:hidden">guest@iq:~$</span>
                </>
              )}
              <span className="text-neonCyan ml-1 terminal-blink font-bold">_</span>
            </div>
          </Link>

          {/* Consolidated Desktop and Tablet Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-xs lg:text-sm tracking-widest font-bold transition-all duration-300 ease-in-out relative py-1 focus:outline-none terminal-cmd group ${
                    isActive
                      ? "text-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                      : "text-textMuted hover:text-textPrimary hover:drop-shadow-[0_0_6px_rgba(245,245,245,0.2)]"
                  }`}
                >
                  {link.label}
                  {/* Underline indicator (visible on desktop) */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-neonCyan transition-all duration-300 origin-left hidden lg:block ${
                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-70"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop/Tablet Sound Mute Toggle */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={toggleSound}
              className={`font-mono text-xs tracking-widest font-bold border rounded px-3 py-1.5 focus:outline-none transition-all duration-300 ease-in-out ${
                soundOn
                  ? "border-neonCyan bg-neonCyan/10 text-neonCyan shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                  : "border-neonViolet/30 bg-bgDark/40 text-textMuted hover:border-neonViolet/60 hover:text-textPrimary"
              }`}
            >
              {soundOn ? "🔊 SOUND: ON" : "🔇 SOUND: OFF"}
            </button>
          </div>

          {/* Mobile Terminal-style $ Prompt Button */}
          {mounted && (
            <div className="flex md:hidden items-center gap-3">
              {/* Mobile Sound Toggle */}
              <button
                onClick={toggleSound}
                className={`font-mono text-xs border rounded w-10 h-10 flex items-center justify-center focus:outline-none transition-all duration-300 ease-in-out ${
                  soundOn
                    ? "border-neonCyan bg-neonCyan/10 text-neonCyan shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                    : "border-neonViolet/20 bg-bgDark/60 text-textMuted"
                }`}
                aria-label="Toggle Sound"
              >
                <span>{soundOn ? "🔊" : "🔇"}</span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                type="button"
                className="flex items-center justify-center w-10 h-10 border border-neonCyan/30 hover:border-neonCyan rounded bg-bgDark/60 text-neonCyan font-mono text-lg font-bold shadow-[0_0_8px_rgba(34,211,238,0.2)] focus:outline-none transition-all duration-300 ease-in-out"
                aria-label="Toggle Navigation Menu"
                aria-expanded={menuOpen}
              >
                <span>$</span>
                <span className="terminal-blink font-light text-neonCyan ml-0.5">_</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Dropdown Slider (Styled as Floating Terminal Box) */}
        <div
          className={`md:hidden absolute top-full left-4 right-4 mt-2 border border-neonCyan/40 bg-bgDark/95 backdrop-blur-lg rounded overflow-hidden transition-all duration-300 ease-in-out font-mono ${
            menuOpen
              ? "max-h-96 opacity-100 py-4 shadow-[0_10px_30px_rgba(34,211,238,0.15)]"
              : "max-h-0 opacity-0 pointer-events-none border-transparent"
          }`}
        >
          {menuOpen && (
            <div className="flex flex-col gap-3 px-6">
              <div className="text-[10px] text-neonViolet/60 uppercase tracking-widest mb-1 select-none">
                {`// SYSTEM COMMANDS`}
              </div>
              {navLinks.map((link) => {
                const isActive = link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm tracking-wide py-2 border-b border-neonViolet/10 transition-all duration-300 ease-in-out terminal-cmd focus:outline-none ${
                      isActive
                        ? "text-neonCyan drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]"
                        : "text-textMuted hover:text-textPrimary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>
    </>
  );
}

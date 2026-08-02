"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const COMMAND_ROUTING: { [key: string]: string } = {
  quiz: "/categories",
  start: "/categories",
  categories: "/categories",
  leaderboard: "/leaderboard",
  "escape-room": "/escape-room",
  home: "/",
};

const VALID_COMMANDS = ["quiz", "start", "categories", "leaderboard", "escape-room", "home"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Functional Command Input States
  const [command, setCommand] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focusedSuggestionIdx, setFocusedSuggestionIdx] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions
  useEffect(() => {
    if (!command.trim() || isErrorState) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = command.toLowerCase().trim();
    const matched = VALID_COMMANDS.filter((cmd) =>
      cmd.startsWith(query)
    );

    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
    setFocusedSuggestionIdx(-1);
  }, [command, isErrorState]);

  // Click outside suggestions list to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const executeCommand = (cmdStr: string) => {
    const cleanCmd = cmdStr.toLowerCase().trim();
    if (cleanCmd in COMMAND_ROUTING) {
      const route = COMMAND_ROUTING[cleanCmd];
      setCommand("");
      setSuggestions([]);
      setShowSuggestions(false);
      router.push(route);
    } else {
      // Flashing red COMMAND NOT FOUND error
      setIsErrorState(true);
      setCommand("COMMAND NOT FOUND");
      setSuggestions([]);
      setShowSuggestions(false);

      setTimeout(() => {
        setCommand("");
        setIsErrorState(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isErrorState) {
      e.preventDefault();
      return;
    }

    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedSuggestionIdx((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedSuggestionIdx((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (focusedSuggestionIdx >= 0 && focusedSuggestionIdx < suggestions.length) {
          executeCommand(suggestions[focusedSuggestionIdx]);
        } else {
          executeCommand(command);
        }
      }
    } else {
      if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(command);
      }
    }
  };

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
    { href: "/", label: "cd /home" },
    { href: "/categories", label: "cd /categories" },
    { href: "/leaderboard", label: "cd /leaderboard" },
    { href: "/escape-room", label: "./escape-room" },
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
          {/* Mobile-only Static Brand Link */}
          <Link
            href="/"
            className="flex md:hidden items-center gap-3 group focus:outline-none"
            aria-label="Impossible Quiz Mainframe - Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
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

            <div className="flex items-center font-mono text-xs sm:text-sm tracking-wider select-none">
              <span className="text-neonViolet font-bold mr-1">[IQ-OS]</span>
              <span className="text-neonCyan">guest@impossiblequiz:~$</span>
              <span className="text-neonCyan ml-1 terminal-blink font-bold">_</span>
            </div>
          </Link>

          {/* Desktop interactive brand and inline prompt input */}
          <div className="hidden md:flex items-center gap-4" ref={containerRef}>
            {/* Clickable Brand Lockup */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none"
              aria-label="Impossible Quiz Mainframe - Home Logo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
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
              <span className="text-neonViolet font-mono text-sm font-bold tracking-wider">[IQ-OS]</span>
            </Link>

            {/* Inline Terminal Prompt & Input field */}
            <div className="relative flex items-center font-mono text-sm tracking-wider">
              <span className="text-neonCyan font-bold mr-1.5">guest@impossiblequiz:~$</span>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  disabled={isErrorState}
                  aria-label="Terminal command prompt. Type quiz, categories, leaderboard, escape-room, or home to navigate."
                  className={`bg-transparent outline-none border-none p-0 m-0 w-36 font-mono font-bold tracking-wider focus:outline-none focus:ring-0 ${
                    isErrorState
                      ? "text-red-500 animate-pulse font-extrabold select-none"
                      : "text-neonCyan"
                  }`}
                  placeholder={isErrorState ? "" : "type cmd..."}
                />

                {/* Visual blinking cursor next to typing caret */}
                {!command && !isErrorState && (
                  <span className="text-neonCyan absolute left-0 ml-16 terminal-blink font-bold pointer-events-none">_</span>
                )}

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    style={{
                      borderColor: "#22d3ee",
                      backgroundColor: "#0a0b10",
                      boxShadow: "0 4px 15px rgba(34, 211, 238, 0.25)",
                    }}
                    className="absolute top-full left-0 mt-2 py-1.5 rounded border border-neonCyan/30 w-44 font-mono text-xs z-50 text-left select-none"
                  >
                    <div className="px-2 pb-1 mb-1 border-b border-neonViolet/10 text-[9px] text-neonViolet font-bold uppercase tracking-widest">
                      SUGGESTIONS
                    </div>
                    {suggestions.map((suggestion, idx) => {
                      const isFocused = idx === focusedSuggestionIdx;
                      return (
                        <button
                          key={suggestion}
                          onClick={() => executeCommand(suggestion)}
                          onMouseEnter={() => setFocusedSuggestionIdx(idx)}
                          className={`w-full text-left px-3 py-1 cursor-pointer transition-colors block text-[11px] ${
                            isFocused
                              ? "bg-neonCyan/10 text-neonCyan font-bold"
                              : "text-textMuted hover:text-textPrimary"
                          }`}
                        >
                          &gt; {suggestion}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-sm tracking-widest font-bold transition-all duration-200 relative py-1 focus:outline-none terminal-cmd group ${
                    isActive
                      ? "text-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                      : "text-textMuted hover:text-textPrimary hover:drop-shadow-[0_0_6px_rgba(245,245,245,0.2)]"
                  }`}
                >
                  {link.label}
                  {/* Underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-neonCyan transition-all duration-300 origin-left ${
                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-70"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Terminal-style $ Prompt Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="flex md:hidden items-center justify-center w-10 h-10 border border-neonCyan/30 hover:border-neonCyan rounded bg-bgDark/60 text-neonCyan font-mono text-lg font-bold shadow-[0_0_8px_rgba(34,211,238,0.2)] focus:outline-none transition-all duration-200"
            aria-label="Toggle Navigation Menu"
            aria-expanded={menuOpen}
          >
            <span>$</span>
            <span className="terminal-blink font-light text-neonCyan ml-0.5">_</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown Slider (Styled as Floating Terminal Box) */}
        <div
          className={`md:hidden absolute top-full left-4 right-4 mt-2 border border-neonCyan/40 bg-bgDark/95 backdrop-blur-lg rounded overflow-hidden transition-all duration-300 ease-in-out font-mono ${
            menuOpen
              ? "max-h-72 opacity-100 py-4 shadow-[0_10px_30px_rgba(34,211,238,0.15)]"
              : "max-h-0 opacity-0 pointer-events-none border-transparent"
          }`}
        >
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
                  className={`text-sm tracking-wide py-2 border-b border-neonViolet/10 transition-all duration-200 terminal-cmd focus:outline-none ${
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
        </div>
      </header>
    </>
  );
}

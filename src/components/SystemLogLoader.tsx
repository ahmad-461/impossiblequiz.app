"use client";

import { useEffect, useState } from "react";

interface SystemLogLoaderProps {
  context: "quiz" | "leaderboard" | "results";
}

const LOG_MESSAGES = {
  quiz: [
    "> HANDSHAKING WITH DIFFICULTY ENGINE...",
    "> COMPILING ADAPTIVE CHALLENGE SET...",
    "> DEPLOYING SECTOR VECTOR...",
  ],
  leaderboard: [
    "> ESTABLISHING ARCHIVE CONNECTION...",
    "> QUERYING MAINFRAME RECORDS...",
    "> SORTING HALL OF CHAMPIONS...",
  ],
  results: [
    "> DECRYPTING SURVIVOR CLEARANCE METRICS...",
    "> COMPUTING PRECISION ACCURACY DATA...",
    "> FINALIZING CLEARANCE REPORT...",
  ],
};

export default function SystemLogLoader({ context }: SystemLogLoaderProps) {
  const messages = LOG_MESSAGES[context] || LOG_MESSAGES.quiz;
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < messages.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 180); // Fast progressive rendering for a responsive feel

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-bgDark font-mono select-none text-left max-w-md w-full mx-auto">
      <div className="w-full border border-neonViolet/30 bg-bgDark/80 p-4 rounded shadow-[0_0_15px_rgba(168,85,247,0.1)]">
        {/* Terminal Header */}
        <div className="flex items-center gap-1.5 border-b border-neonViolet/10 pb-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-neonViolet/70"></div>
          <div className="w-2 h-2 rounded-full bg-neonCyan/70"></div>
          <div className="w-2 h-2 rounded-full bg-textMuted/40"></div>
          <span className="text-[9px] text-textMuted/60 uppercase ml-2 tracking-widest">
            SYS.TERMINAL // {context.toUpperCase()}_VECTOR
          </span>
        </div>

        {/* Logs Console */}
        <div className="space-y-1.5 min-h-[72px] flex flex-col justify-start">
          {messages.slice(0, visibleCount).map((msg, index) => {
            const isLast = index === visibleCount - 1;
            return (
              <div
                key={index}
                className={`text-xs tracking-wider transition-opacity duration-150 ${
                  isLast ? "text-neonCyan animate-pulse" : "text-textMuted"
                }`}
              >
                {msg}
              </div>
            );
          })}
          {visibleCount < messages.length && (
            <div className="text-xs text-neonViolet animate-pulse flex items-center gap-1 mt-1">
              <span>&gt; LOADING</span>
              <span className="inline-block w-1.5 h-3.5 bg-neonViolet animate-blink"></span>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
      `}} />
    </div>
  );
}

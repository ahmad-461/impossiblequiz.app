"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DailyQuizResult {
  score: number;
  peakStreak: number;
  date: string;
  categoryName: string;
  isPractice: boolean;
  questionsCount: number;
}

export default function DailyResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<DailyQuizResult | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("daily_quiz_result");
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        router.push("/");
      }
    } catch (e) {
      console.error("Error reading daily quiz results:", e);
      router.push("/");
    }
  }, [router]);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || !nickname.trim() || submitting || submitted || result.isPractice) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/daily-challenge/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          score: result.score,
          streak: result.peakStreak,
          date: result.date
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);

      // Save to localStorage to enforce the single run per day
      localStorage.setItem(`daily_challenge_played_${result.date}`, "true");

      // Set the active_quiz_session result to pass state to the leaderboard highlight
      const sharedResult = {
        score: result.score,
        peakStreak: result.peakStreak,
        category: `daily_${result.date}`,
        nickname: data.nickname,
        submitted: true,
        submittedId: data.submittedId
      };
      sessionStorage.setItem("impossible_quiz_result", JSON.stringify(sharedResult));

    } catch (err: unknown) {
      console.error("Error submitting daily score:", err);
      const message = err instanceof Error ? err.message : "Mainframe synchronization failed.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!result) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-xl mx-auto w-full select-none animate-page-fade font-display">

      {/* Badge Indicator */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonViolet/10 border border-neonViolet/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-neonViolet uppercase">
        ⚡ DAILY RUN TERMINATED ⚡
      </div>

      <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-center uppercase">
        RUN{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          SUMMARY
        </span>
      </h1>

      <p className="text-textMuted text-center text-xs md:text-sm mb-8 uppercase tracking-wider">
        SYSTEM REPORT {"//"} DAILY CHALLENGE: {result.categoryName} {"//"} {result.date}
      </p>

      {/* Main Results Card */}
      <div className="w-full bg-bgDark border-2 border-neonViolet/30 rounded-lg p-6 md:p-8 relative shadow-[0_0_20px_rgba(168,85,247,0.15)] mb-8 overflow-hidden">
        {/* Glow corner highlights */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neonCyan"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neonCyan"></div>

        <div className="grid grid-cols-2 gap-6 text-center divide-x divide-neonViolet/15">
          {/* Score display */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] tracking-widest text-textMuted uppercase mb-1">TOTAL SCORE</span>
            <span className="text-3xl md:text-4xl font-black text-neonCyan">
              {result.score.toLocaleString()}
            </span>
          </div>

          {/* Peak Streak display */}
          <div className="flex flex-col justify-center pl-6">
            <span className="text-[10px] tracking-widest text-textMuted uppercase mb-1">PEAK STREAK</span>
            <span className="text-3xl md:text-4xl font-black text-neonViolet flex items-center justify-center gap-1.5">
              {result.peakStreak}
              <span className="text-xl">🔥</span>
            </span>
          </div>
        </div>

        {/* Practice Mode disclaimer */}
        {result.isPractice && (
          <div className="mt-6 p-3 rounded border border-red-500/30 bg-red-500/5 text-red-400 text-[10px] text-center tracking-widest uppercase">
            ⚠️ PRACTICE MODE PROTOCOL: NO SCORE UPLOAD PERMITTED ⚠️
          </div>
        )}
      </div>

      {/* Score Upload Form */}
      {!result.isPractice && !submitted && (
        <form onSubmit={handleSubmitScore} className="w-full flex flex-col gap-4 mb-8">
          <label htmlFor="nickname" className="text-[10px] tracking-widest text-textMuted uppercase font-semibold">
            SECURE YOUR IDENTITY (MAX 15 CHARACTERS)
          </label>
          <div className="flex gap-2 w-full">
            <input
              id="nickname"
              type="text"
              required
              maxLength={15}
              placeholder="ENTER NICKNAME"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 bg-bgDark border-2 border-neonViolet/30 focus:border-neonCyan hover:border-neonViolet/60 rounded px-4 py-3 text-sm text-textPrimary focus:outline-none transition-colors duration-200 uppercase tracking-widest"
            />
            <button
              type="submit"
              disabled={submitting || !nickname.trim()}
              className="bg-neonViolet border border-transparent hover:border-neonCyan hover:bg-neonViolet/90 text-textPrimary px-6 py-3 rounded text-xs font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            >
              {submitting ? "SYNCING..." : "SUBMIT SCORE"}
            </button>
          </div>
          {errorMsg && (
            <p className="text-xs text-red-500 font-semibold mt-1 tracking-wide uppercase">
              {errorMsg}
            </p>
          )}
        </form>
      )}

      {/* Successful Submission Banner */}
      {submitted && (
        <div className="w-full py-4 px-6 rounded mb-8 border border-neonCyan/40 bg-neonCyan/10 text-neonCyan shadow-[0_0_15px_rgba(34,211,238,0.2)] text-center tracking-wider text-xs md:text-sm animate-pulse uppercase">
          🚀 Score Synchronized to Mainframe Database! 🚀
        </div>
      )}

      {/* Redirect buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link
          href={`/leaderboard?category=daily_${result.date}`}
          className="flex-1 inline-flex items-center justify-center px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded border border-neonCyan/30 hover:border-neonCyan bg-bgDark hover:bg-neonCyan/5 text-neonCyan text-center"
        >
          VIEW DAILY LEADERBOARD
        </Link>
        <Link
          href="/"
          className="flex-1 group relative inline-flex items-center justify-center px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none border border-transparent hover:border-neonCyan text-center shadow-[0_0_12px_rgba(168,85,247,0.4)]"
        >
          <span className="absolute inset-0 w-full h-full rounded bg-gradient-to-r from-neonViolet to-neonCyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></span>
          RETURN TO HOME
        </Link>
      </div>
    </div>
  );
}

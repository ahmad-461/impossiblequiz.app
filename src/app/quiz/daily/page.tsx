"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Question } from "../../../lib/questions";
import SystemLogLoader from "../../../components/SystemLogLoader";

export default function DailyQuizPage() {
  const router = useRouter();

  // Core quiz states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [peakStreak, setPeakStreak] = useState<number>(0);
  const [isPractice, setIsPractice] = useState<boolean>(false);
  const [dateStr, setDateStr] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");

  // Loading/API state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selection/Feedback states
  const [selectionState, setSelectionState] = useState<"idle" | "selected">("idle");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);

  // Timer states
  const [timer, setTimer] = useState<number>(30);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const handleTimeoutRef = useRef<(() => void) | null>(null);

  // Helper to save session state to sessionStorage
  const saveSessionState = (
    loadedQs: Question[],
    idx: number,
    currentLives: number,
    currentScore: number,
    currentStreak: number,
    currentPeakStreak: number,
    practiceMode: boolean,
    date: string,
    cat: string
  ) => {
    try {
      const stateObj = {
        questions: loadedQs,
        currentIdx: idx,
        lives: currentLives,
        score: currentScore,
        streak: currentStreak,
        peakStreak: currentPeakStreak,
        isPractice: practiceMode,
        dateStr: date,
        categoryName: cat,
      };
      sessionStorage.setItem("active_daily_quiz_session", JSON.stringify(stateObj));
    } catch (e) {
      console.error("Failed to save daily quiz session:", e);
    }
  };

  // Helper to clear session state from sessionStorage
  const clearSessionState = () => {
    try {
      sessionStorage.removeItem("active_daily_quiz_session");
    } catch (e) {
      console.error("Failed to clear daily quiz session:", e);
    }
  };

  // Load daily challenge questions
  useEffect(() => {
    const initDailyQuiz = async () => {
      setIsLoading(true);

      // Try restoring from sessionStorage
      let restored = null;
      try {
        const stored = sessionStorage.getItem("active_daily_quiz_session");
        if (stored) {
          restored = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Failed to restore daily quiz session:", e);
      }

      if (restored && restored.questions && restored.questions.length > 0) {
        setQuestions(restored.questions);
        setCurrentIdx(restored.currentIdx);
        setLives(restored.lives);
        setScore(restored.score);
        setStreak(restored.streak);
        setPeakStreak(restored.peakStreak);
        setIsPractice(restored.isPractice);
        setDateStr(restored.dateStr);
        setCategoryName(restored.categoryName);
        setIsLoading(false);
        return;
      }

      // Fresh initialization
      try {
        const res = await fetch("/api/daily-challenge");
        if (!res.ok) {
          throw new Error("Failed to load daily challenge");
        }
        const data = await res.json();
        setQuestions(data.questions);
        setDateStr(data.date);
        setCategoryName(data.categoryName);

        // Check if player has already played today
        const localPlayed = localStorage.getItem(`daily_challenge_played_${data.date}`);
        const practice = !!localPlayed;
        setIsPractice(practice);

        setLives(3);
        setScore(0);
        setStreak(0);
        setPeakStreak(0);
        setCurrentIdx(0);

        saveSessionState(data.questions, 0, 3, 0, 0, 0, practice, data.date, data.categoryName);
      } catch (err) {
        console.error("Error loading daily challenge:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initDailyQuiz();

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Handle countdown Timer
  useEffect(() => {
    if (selectionState === "selected" || questions.length === 0 || isLoading) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    setTimer(30);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          if (handleTimeoutRef.current) {
            handleTimeoutRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [currentIdx, selectionState, isLoading, questions]);

  const finishQuiz = (finalScore: number, finalPeakStreak: number) => {
    clearSessionState();
    const resultState = {
      score: finalScore,
      peakStreak: finalPeakStreak,
      date: dateStr,
      categoryName,
      isPractice,
      questionsCount: questions.length
    };
    sessionStorage.setItem("daily_quiz_result", JSON.stringify(resultState));
    router.push("/quiz/daily/results");
  };

  const processAnswer = (correct: boolean, chosenIdx: number | null) => {
    if (selectionState === "selected" || questions.length === 0) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setSelectionState("selected");
    setSelectedIdx(chosenIdx);
    setIsCorrectSelection(correct);

    let nextLives = lives;
    let nextScore = score;
    let nextStreak = streak;
    let nextPeak = peakStreak;

    const currentQuestion = questions[currentIdx];

    if (correct) {
      nextStreak += 1;
      setStreak(nextStreak);
      if (nextStreak > nextPeak) {
        nextPeak = nextStreak;
        setPeakStreak(nextPeak);
      }

      let basePoints = 100;
      if (currentQuestion.difficulty === "medium") basePoints = 200;
      if (currentQuestion.difficulty === "hard") basePoints = 300;

      const scoredPoints = Math.round(basePoints * (1 + nextStreak * 0.1));
      nextScore += scoredPoints;
      setScore(nextScore);
    } else {
      nextStreak = 0;
      setStreak(0);
      nextLives -= 1;
      setLives(nextLives);
    }

    const nextIdx = currentIdx + 1;
    const isGameOver = nextLives <= 0 || nextIdx >= questions.length;

    setTimeout(() => {
      if (isGameOver) {
        finishQuiz(nextScore, nextPeak);
        return;
      }

      // Transition to next question
      setCurrentIdx(nextIdx);
      setSelectionState("idle");
      setSelectedIdx(null);
      setIsCorrectSelection(null);

      saveSessionState(
        questions,
        nextIdx,
        nextLives,
        nextScore,
        nextStreak,
        nextPeak,
        isPractice,
        dateStr,
        categoryName
      );
    }, 2000);
  };

  const handleTimeout = () => {
    processAnswer(false, null);
  };

  useEffect(() => {
    handleTimeoutRef.current = handleTimeout;
  });

  const handleOptionSelect = (idx: number) => {
    if (selectionState === "selected" || questions.length === 0) return;
    const currentQuestion = questions[currentIdx];
    const correct = idx === currentQuestion.correctAnswerIndex;
    processAnswer(correct, idx);
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <SystemLogLoader context="quiz" />
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-12 max-w-4xl mx-auto w-full select-none animate-page-fade">
      {/* Metrics Bar */}
      <div className="w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 border-b border-neonViolet/20 pb-4">
        {/* Active category details */}
        <div className="flex flex-col text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-[10px] font-display tracking-widest text-textMuted uppercase">DAILY CHALLENGE</span>
            {isPractice && (
              <span className="bg-[#ef4444]/10 border border-[#ef4444]/30 px-2 py-0.5 rounded-full text-[9px] font-bold font-display tracking-widest text-[#ef4444] uppercase animate-pulse">
                PRACTICE PROTOCOL ACTIVE
              </span>
            )}
          </div>
          <span className="text-sm font-black text-neonCyan font-display uppercase tracking-wider">
            {categoryName} {" // "} {dateStr}
          </span>
        </div>

        {/* Lives, Streak, and Score indicators */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto">
          {/* Shields */}
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] font-display tracking-widest text-textMuted uppercase mb-1">SHIELD</span>
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, idx) => {
                const heart = idx + 1;
                return (
                  <span
                    key={heart}
                    className={`text-lg transition-all duration-300 ${
                      heart <= lives ? "opacity-100 scale-100 filter drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" : "opacity-20 scale-90"
                    }`}
                  >
                    ❤️
                  </span>
                );
              })}
            </div>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] font-display tracking-widest text-textMuted uppercase mb-1">STREAK</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-black text-neonViolet font-display">
                {streak}
              </span>
              <span className={`text-base transition-transform duration-300 ${streak > 0 ? "scale-110" : "opacity-35"}`}>
                🔥
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="text-left md:text-right">
            <span className="text-[10px] font-display tracking-widest text-textMuted block uppercase mb-1">SCORE</span>
            <span className="text-sm font-black text-neonCyan font-display">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-display tracking-widest text-textMuted block uppercase mb-1">TIMER</span>
              <span className={`text-sm font-black font-display transition-colors duration-200 ${timer <= 5 ? "text-neonViolet animate-pulse" : "text-neonCyan"}`}>
                {timer < 10 ? `00:0${timer}` : `00:${timer}`}
              </span>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${timer <= 5 ? "bg-neonViolet animate-ping" : "bg-neonCyan"}`}></div>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-1 bg-bgDark border border-neonViolet/20 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${timer <= 5 ? "bg-neonViolet" : "bg-gradient-to-r from-neonCyan to-neonViolet"}`}
          style={{ width: `${(timer / 30) * 100}%` }}
        ></div>
      </div>

      {/* Main Question Display */}
      <div className="w-full p-6 md:p-8 rounded-lg bg-bgDark border-2 border-neonViolet/30 shadow-[0_0_15px_rgba(168,85,247,0.1)] relative">
        {/* Glow corners decoration */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neonCyan"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neonCyan"></div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] font-display tracking-widest px-2.5 py-1 rounded uppercase border text-neonCyan bg-neonCyan/10 border-neonCyan/25">
            DIFFICULTY: {currentQuestion.difficulty}
          </span>

          <span className="text-[10px] font-display tracking-widest text-textMuted font-bold uppercase">
            {currentIdx + 1} OF 5
          </span>
        </div>

        <h2 className="text-lg md:text-2xl font-bold tracking-tight mt-6 mb-8 text-textPrimary leading-snug">
          {currentQuestion.questionText}
        </h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option: string, idx: number) => {
            const letters = ["A", "B", "C", "D"];

            // Selection feedback styles
            let borderClass = "border-neonViolet/20 hover:border-neonCyan hover:bg-neonCyan/5";
            let letterBgClass = "bg-neonViolet/10 group-hover:bg-neonCyan/20 border-neonViolet/30 group-hover:border-neonCyan text-neonViolet group-hover:text-neonCyan";
            let textClass = "text-textMuted group-hover:text-textPrimary";

            if (selectionState === "selected") {
              const isCorrectAnswer = idx === currentQuestion.correctAnswerIndex;
              const isSelectedAnswer = idx === selectedIdx;

              if (isCorrectAnswer) {
                borderClass = "border-neonCyan bg-neonCyan/10 shadow-[0_0_10px_rgba(34,211,238,0.4)]";
                letterBgClass = "bg-neonCyan border-neonCyan text-bgDark";
                textClass = "text-neonCyan font-bold";
              } else if (isSelectedAnswer) {
                borderClass = "border-neonViolet bg-neonViolet/10 shadow-[0_0_10px_rgba(168,85,247,0.4)]";
                letterBgClass = "bg-neonViolet border-neonViolet text-textPrimary";
                textClass = "text-neonViolet font-bold";
              } else {
                borderClass = "border-neonViolet/10 opacity-30 cursor-not-allowed";
                letterBgClass = "bg-neonViolet/5 border-neonViolet/10 text-textMuted";
                textClass = "text-textMuted";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={selectionState === "selected"}
                aria-label={`Option ${letters[idx]}: ${option}`}
                className={`group flex items-center p-4 rounded border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neonCyan ${
                  selectionState === "selected" ? "cursor-not-allowed" : "cursor-pointer"
                } ${borderClass}`}
              >
                <span className={`w-8 h-8 rounded flex items-center justify-center font-display font-bold mr-4 transition-colors duration-200 border ${letterBgClass}`}>
                  {letters[idx]}
                </span>
                <span className={`text-sm font-semibold transition-colors duration-200 flex-1 ${textClass}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback Alert Banner */}
      {selectionState === "selected" && (
        <div className={`w-full py-4 px-6 rounded mb-6 mt-6 border font-display text-center tracking-wider text-xs md:text-sm transition-all duration-300 ${
          isCorrectSelection
            ? "bg-neonCyan/10 border-neonCyan/40 text-neonCyan shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse"
            : "bg-neonViolet/10 border-neonViolet/40 text-neonViolet shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        }`}>
          {isCorrectSelection ? (
            <span>{"🚀 INTRUSION SUCCESSFUL // SCORE GAINED +STREAK MULTIPLIER 🚀"}</span>
          ) : (
            <span>{"🛡️ SECURITY COUNTER-MEASURES TRIGGERED // LIVES DECREMENTED 🛡️"}</span>
          )}
        </div>
      )}

      {/* Bottom retreat option */}
      <div className="w-full flex justify-between items-center mt-6 font-display">
        <Link
          href="/"
          onClick={clearSessionState}
          className="text-xs font-display tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5 focus:outline-none focus:ring-1 focus:ring-neonViolet"
        >
          ← ABANDON DAILY RUN
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { staticQuestions, Question } from "../../lib/questions";

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected Category ID (e.g. programming, logic-algorithms, data-analytics, computer-science-fundamentals)
  const categoryId = searchParams.get("category") || "programming";

  // Filter pool questions to the current category
  const categoryQuestions = staticQuestions.filter((q) => q.category === categoryId);

  // States
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [peakStreak, setPeakStreak] = useState<number>(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);

  // Difficulty States
  const [currentDifficulty, setCurrentDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  // Streak *within* the current difficulty level
  const [difficultyStreak, setDifficultyStreak] = useState<number>(0);

  // Remaining unanswered question IDs
  const [unansweredIds, setUnansweredIds] = useState<string[]>([]);
  // Current active question
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Feedback Selection State
  // "idle" | "selected"
  const [selectionState, setSelectionState] = useState<"idle" | "selected">("idle");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);

  // Timer state
  const [timer, setTimer] = useState<number>(30);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep stable helper references or use state/ref to avoid dependency warnings
  const selectNextQuestionRef = useRef<((targetDiff: "easy" | "medium" | "hard", poolIds: string[], lastQuestionId: string | null) => void) | null>(null);
  const handleTimeoutRef = useRef<(() => void) | null>(null);

  // Define helper function
  const selectNextQuestion = (
    targetDiff: "easy" | "medium" | "hard",
    poolIds: string[],
    lastQuestionId: string | null
  ) => {
    // Candidates are unanswered questions in the current difficulty
    let candidates = categoryQuestions.filter(
      (q) => poolIds.includes(q.id) && q.difficulty === targetDiff && q.id !== lastQuestionId
    );

    // If target difficulty has no questions left, fallback search:
    if (candidates.length === 0) {
      const fallbackDiffs: ("easy" | "medium" | "hard")[] = ["hard", "medium", "easy"];
      for (const d of fallbackDiffs) {
        candidates = categoryQuestions.filter(
          (q) => poolIds.includes(q.id) && q.difficulty === d && q.id !== lastQuestionId
        );
        if (candidates.length > 0) {
          targetDiff = d;
          setCurrentDifficulty(d);
          break;
        }
      }
    }

    if (candidates.length === 0) {
      setCurrentQuestion(null);
      return;
    }

    const nonBossHardCandidates = candidates.filter((q) => !q.isBossRound);
    const bossHardCandidate = candidates.find((q) => q.isBossRound);

    let finalSelection: Question;

    if (targetDiff === "hard") {
      if (nonBossHardCandidates.length > 0) {
        const randIdx = Math.floor(Math.random() * nonBossHardCandidates.length);
        finalSelection = nonBossHardCandidates[randIdx];
      } else if (bossHardCandidate) {
        finalSelection = bossHardCandidate;
      } else {
        const randIdx = Math.floor(Math.random() * candidates.length);
        finalSelection = candidates[randIdx];
      }
    } else {
      const randIdx = Math.floor(Math.random() * candidates.length);
      finalSelection = candidates[randIdx];
    }

    setCurrentQuestion(finalSelection);
  };

  useEffect(() => {
    selectNextQuestionRef.current = selectNextQuestion;
  });


  // Initialize Quiz Session once on mount (or if category changes)
  useEffect(() => {
    // staticQuestions is static, categoryId is query param
    const currentPool = staticQuestions.filter((q) => q.category === categoryId);
    const ids = currentPool.map((q) => q.id);
    setUnansweredIds(ids);
    setLives(3);
    setScore(0);
    setStreak(0);
    setPeakStreak(0);
    setTotalQuestionsAnswered(0);
    setTotalCorrectAnswers(0);
    setCurrentDifficulty("easy");
    setDifficultyStreak(0);
    setSelectionState("idle");
    setSelectedIdx(null);
    setIsCorrectSelection(null);
    setTimer(30);

    // Choose first question
    if (selectNextQuestionRef.current) {
      selectNextQuestionRef.current("easy", ids, null);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [categoryId]);

  // Handle countdown Timer
  useEffect(() => {
    if (selectionState === "selected" || !currentQuestion) {
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
  }, [currentQuestion, selectionState]);

  // Define timeout function
  const handleTimeout = () => {
    setSelectionState("selected");
    setSelectedIdx(null);
    setIsCorrectSelection(false);

    setStreak(0);
    setDifficultyStreak(0);

    const nextLives = lives - 1;
    setLives(nextLives);
    setTotalQuestionsAnswered((prev) => prev + 1);

    const nextDiff = getLowerDifficulty(currentDifficulty);
    setCurrentDifficulty(nextDiff);

    const nextUnanswered = unansweredIds.filter((id) => id !== currentQuestion?.id);
    setUnansweredIds(nextUnanswered);

    setTimeout(() => {
      if (nextLives <= 0) {
        finishQuiz(0, streak, "defeat", totalCorrectAnswers, totalQuestionsAnswered + 1);
      } else {
        advanceNext(nextDiff, nextUnanswered);
      }
    }, 2000);
  };

  useEffect(() => {
    handleTimeoutRef.current = handleTimeout;
  });

  // Helper to drop difficulty
  const getLowerDifficulty = (diff: "easy" | "medium" | "hard"): "easy" | "medium" | "hard" => {
    if (diff === "hard") return "medium";
    return "easy";
  };

  // Helper to increase difficulty
  const getHigherDifficulty = (diff: "easy" | "medium" | "hard"): "easy" | "medium" | "hard" => {
    if (diff === "easy") return "medium";
    if (diff === "medium") return "hard";
    return "hard";
  };


  // Logic to advance after a result feedback delay
  const advanceNext = (nextDiff: "easy" | "medium" | "hard", nextUnanswered: string[]) => {
    setSelectionState("idle");
    setSelectedIdx(null);
    setIsCorrectSelection(null);

    // If no questions are left in unanswered pool, finish as pool_victory
    if (nextUnanswered.length === 0) {
      finishQuiz(score, streak, "pool_victory", totalCorrectAnswers, totalQuestionsAnswered);
      return;
    }

    if (selectNextQuestionRef.current) {
      selectNextQuestionRef.current(nextDiff, nextUnanswered, currentQuestion?.id || null);
    }
  };

  // Handle option selection
  const handleOptionSelect = (idx: number) => {
    if (selectionState === "selected" || !currentQuestion) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setSelectionState("selected");
    setSelectedIdx(idx);
    const correct = idx === currentQuestion.correctAnswerIndex;
    setIsCorrectSelection(correct);

    const nextUnanswered = unansweredIds.filter((id) => id !== currentQuestion.id);
    setUnansweredIds(nextUnanswered);
    setTotalQuestionsAnswered((prev) => prev + 1);

    let nextLives = lives;
    let nextScore = score;
    let nextStreak = streak;
    let nextDiff = currentDifficulty;
    let nextDiffStreak = difficultyStreak;
    let nextCorrect = totalCorrectAnswers;

    if (correct) {
      nextCorrect += 1;
      setTotalCorrectAnswers(nextCorrect);

      // Calculate streak
      nextStreak += 1;
      setStreak(nextStreak);
      if (nextStreak > peakStreak) {
        setPeakStreak(nextStreak);
      }

      // Calculate score points
      let basePoints = 100;
      if (currentDifficulty === "medium") basePoints = 200;
      if (currentDifficulty === "hard") basePoints = 300;

      const scoredPoints = Math.round(basePoints * (1 + nextStreak * 0.1));
      nextScore += scoredPoints;
      setScore(nextScore);

      // Handle difficulty progression
      nextDiffStreak += 1;
      if (nextDiffStreak >= 3) {
        // Promote difficulty
        const promotedDiff = getHigherDifficulty(currentDifficulty);
        nextDiff = promotedDiff;
        setCurrentDifficulty(promotedDiff);
        // Reset local difficulty streak
        nextDiffStreak = 0;
        setDifficultyStreak(0);
      } else {
        setDifficultyStreak(nextDiffStreak);
      }
    } else {
      // Wrong answer
      nextStreak = 0;
      setStreak(0);
      nextDiffStreak = 0;
      setDifficultyStreak(0);

      // Lose life
      nextLives -= 1;
      setLives(nextLives);

      // Drop difficulty immediately
      const demotedDiff = getLowerDifficulty(currentDifficulty);
      nextDiff = demotedDiff;
      setCurrentDifficulty(demotedDiff);
    }

    // Check end condition
    setTimeout(() => {
      // 1. Defeat
      if (nextLives <= 0) {
        finishQuiz(nextScore, Math.max(peakStreak, nextStreak), "defeat", nextCorrect, totalQuestionsAnswered + 1);
        return;
      }

      // 2. Boss Defeated (Was it the boss question and answered correctly?)
      if (correct && currentQuestion.isBossRound) {
        finishQuiz(nextScore, Math.max(peakStreak, nextStreak), "boss_victory", nextCorrect, totalQuestionsAnswered + 1);
        return;
      }

      // 3. Pool cleared or advance
      if (nextUnanswered.length === 0) {
        finishQuiz(nextScore, Math.max(peakStreak, nextStreak), "pool_victory", nextCorrect, totalQuestionsAnswered + 1);
      } else {
        advanceNext(nextDiff, nextUnanswered);
      }
    }, 2000);
  };

  // Package state and navigate to /results
  const finishQuiz = (
    finalScore: number,
    finalPeakStreak: number,
    outcome: "boss_victory" | "pool_victory" | "defeat",
    correct: number,
    total: number
  ) => {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const resultState = {
      score: finalScore,
      peakStreak: finalPeakStreak,
      category: categoryId,
      outcome,
      accuracy,
      correct,
      total
    };
    sessionStorage.setItem("impossible_quiz_result", JSON.stringify(resultState));
    router.push("/results");
  };

  // Render
  if (!currentQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-neonCyan border-t-transparent animate-spin mb-4"></div>
        <span className="text-sm font-mono tracking-widest text-textMuted uppercase">LOADING QUIZ VECTOR...</span>
      </div>
    );
  }

  // Set category label
  let categoryLabel = "SYS.CORE";
  if (categoryId === "programming") categoryLabel = "SYS.LANG";
  if (categoryId === "logic-algorithms") categoryLabel = "ALG.COMP";
  if (categoryId === "data-analytics") categoryLabel = "DAT.SCALE";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full select-none">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-neonViolet/20 pb-4">
        {/* Active category details */}
        <div className="flex flex-col">
          <span className="text-xs font-mono tracking-widest text-textMuted uppercase">CURRENT SIMULATION</span>
          <span className="text-sm font-bold text-neonCyan font-mono uppercase">
            {categoryId.replace("-", " ")} {" // "} {categoryLabel}
          </span>
        </div>

        {/* Lives, Streak, and Score indicators */}
        <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto">
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs font-mono tracking-widest text-textMuted uppercase mb-1">SHIELD</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((heart) => (
                <span
                  key={heart}
                  className={`text-xl transition-all duration-300 ${
                    heart <= lives ? "opacity-100 scale-100 filter drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" : "opacity-20 scale-90"
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs font-mono tracking-widest text-textMuted uppercase mb-1">STREAK</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-neonViolet font-mono">
                {streak}
              </span>
              <span className={`text-lg transition-transform duration-300 ${streak > 0 ? "animate-bounce scale-110" : "opacity-30"}`}>
                🔥
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono tracking-widest text-textMuted block uppercase mb-1">SCORE</span>
            <span className="text-sm font-bold text-neonCyan font-mono">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <span className="text-xs font-mono tracking-widest text-textMuted block uppercase mb-1">TIMER</span>
              <span className={`text-sm font-bold font-mono transition-colors duration-200 ${timer <= 5 ? "text-neonViolet animate-pulse" : "text-neonCyan"}`}>
                {timer < 10 ? `00:0${timer}` : `00:${timer}`}
              </span>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${timer <= 5 ? "bg-neonViolet animate-ping" : "bg-neonCyan"}`}></div>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-1.5 bg-bgDark border border-neonViolet/20 rounded-full mb-8 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${timer <= 5 ? "bg-neonViolet" : "bg-gradient-to-r from-neonCyan to-neonViolet"}`}
          style={{ width: `${(timer / 30) * 100}%` }}
        ></div>
      </div>

      {/* Main Question Display */}
      <div className="w-full p-8 rounded-lg bg-bgDark border-2 border-neonViolet/30 shadow-[0_0_15px_rgba(168,85,247,0.1)] mb-8 relative">
        {/* Glow corners decoration */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neonCyan"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neonCyan"></div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <span className="text-xs font-mono tracking-widest text-neonCyan bg-neonCyan/10 border border-neonCyan/20 px-2.5 py-1 rounded uppercase">
            DIFFICULTY: {currentDifficulty}
          </span>

          {currentQuestion.isBossRound && (
            <span className="text-xs font-mono tracking-widest text-neonViolet bg-neonViolet/10 border border-neonViolet/20 px-2.5 py-1 rounded animate-pulse">
              ⚠️ BOSS ROUND ⚠️
            </span>
          )}

          <span className="text-xs font-mono tracking-widest text-textMuted">
            {totalQuestionsAnswered + 1} OF 10 ESTIMATED
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-6 mb-8 text-textPrimary leading-snug">
          {currentQuestion.questionText}
        </h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const letters = ["A", "B", "C", "D"];

            // Selection feedback styles
            let borderClass = "border-neonViolet/20 hover:border-neonCyan hover:bg-neonCyan/5";
            let letterBgClass = "bg-neonViolet/10 group-hover:bg-neonCyan/20 border-neonViolet/30 group-hover:border-neonCyan text-neonViolet group-hover:text-neonCyan";
            let textClass = "text-textMuted group-hover:text-textPrimary";

            if (selectionState === "selected") {
              const isCorrectAnswer = idx === currentQuestion.correctAnswerIndex;
              const isSelectedAnswer = idx === selectedIdx;

              if (isCorrectAnswer) {
                // Correct choice is highlighted in neonCyan (emerald alternative)
                borderClass = "border-neonCyan bg-neonCyan/10 shadow-[0_0_10px_rgba(34,211,238,0.4)]";
                letterBgClass = "bg-neonCyan border-neonCyan text-bgDark";
                textClass = "text-neonCyan font-bold";
              } else if (isSelectedAnswer) {
                // Incorrect chosen index is highlighted in neonViolet (critical red alternative)
                borderClass = "border-neonViolet bg-neonViolet/10 shadow-[0_0_10px_rgba(168,85,247,0.4)]";
                letterBgClass = "bg-neonViolet border-neonViolet text-textPrimary";
                textClass = "text-neonViolet font-bold";
              } else {
                // Non-chosen incorrect answers are styled dimly
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
                className={`group flex items-center p-4 rounded-md border text-left transition-all duration-200 ${
                  selectionState === "selected" ? "cursor-not-allowed" : "cursor-pointer"
                } ${borderClass}`}
              >
                <span className={`w-8 h-8 rounded-md flex items-center justify-center font-mono font-bold mr-4 transition-colors duration-200 border ${letterBgClass}`}>
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
        <div className={`w-full py-4 px-6 rounded-md mb-8 border font-mono text-center tracking-wider text-sm transition-all duration-300 ${
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
      <div className="w-full flex justify-between items-center mt-4">
        <Link
          href="/categories"
          className="text-xs font-mono tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5"
        >
          ← RETREAT (CATEGORIES)
        </Link>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-neonCyan border-t-transparent animate-spin mb-4"></div>
        <span className="text-sm font-mono tracking-widest text-textMuted uppercase">LOADING QUIZ VECTOR...</span>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}

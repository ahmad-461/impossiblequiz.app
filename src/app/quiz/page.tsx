"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { Question } from "../../lib/questions";

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected Category ID (e.g. programming, logic-algorithms, data-analytics, computer-science-fundamentals)
  const categoryId = searchParams.get("category") || "programming";

  // States
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [peakStreak, setPeakStreak] = useState<number>(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);

  // Difficulty States & History
  const [currentDifficulty, setCurrentDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [history, setHistory] = useState<{ correct: boolean; difficulty: "easy" | "medium" | "hard" }[]>([]);
  const [alreadyAskedTexts, setAlreadyAskedTexts] = useState<string[]>([]);
  const [alreadyAskedIds, setAlreadyAskedIds] = useState<string[]>([]);

  // Current active question & Pre-fetched question
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
  const [nextQuestionDifficulty, setNextQuestionDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [nextQuestionIsBoss, setNextQuestionIsBoss] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Feedback Selection State
  const [selectionState, setSelectionState] = useState<"idle" | "selected">("idle");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);

  // Timer state
  const [timer, setTimer] = useState<number>(30);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // References for keeping state updated in callbacks
  const handleTimeoutRef = useRef<(() => void) | null>(null);

  // Helper to check if the simulated/actual history should trigger a Boss Round
  const checkIsBossRound = (hist: { correct: boolean; difficulty: "easy" | "medium" | "hard" }[]): boolean => {
    if (hist.length < 3) return false;
    const last3 = hist.slice(-3);
    return last3.every((h) => h.correct && h.difficulty === "hard");
  };

  // Helper to fetch a question from our Next.js API Route
  const fetchQuestionFromAPI = async (
    diff: "easy" | "medium" | "hard",
    isBoss: boolean,
    askedTexts: string[],
    askedIds: string[]
  ): Promise<Question | null> => {
    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: categoryId,
          difficulty: diff,
          alreadyAskedTexts: askedTexts,
          alreadyAskedIds: askedIds,
          isBossRound: isBoss,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.question;
      }
    } catch (e) {
      console.error("Failed to fetch question from API:", e);
    }
    return null;
  };

  // Package state and navigate to /results
  const finishQuiz = (
    finalScore: number,
    finalPeakStreak: number,
    outcome: "boss_victory" | "pool_victory" | "defeat" | "boss_defeat",
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
      total,
    };
    sessionStorage.setItem("impossible_quiz_result", JSON.stringify(resultState));
    router.push("/results");
  };

  // Helper to trigger optimistic pre-fetching for the subsequent question
  const triggerPrefetch = async (
    currQuestion: Question,
    currHistory: { correct: boolean; difficulty: "easy" | "medium" | "hard" }[],
    askedTexts: string[],
    askedIds: string[]
  ) => {
    // Optimistic prediction: assume player gets the current question correct
    const simHistory = [...currHistory, { correct: true, difficulty: currQuestion.difficulty }];

    let predictedDiff: "easy" | "medium" | "hard" = "easy";
    try {
      const res = await fetch("/api/difficulty-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: simHistory }),
      });
      if (!res.ok) {
        throw new Error(`Difficulty engine prefetch responded with status ${res.status}`);
      }
      const data = await res.json();
      predictedDiff = data.nextDifficulty;
    } catch (err) {
      console.error("Error predicting difficulty in pre-fetch, using client-side fallback:", err);

      // Client-side fallback prediction logic
      // Streak of 3 correct answers within the same tier promotes
      // Since we simulate getting currQuestion correct, let's see how many consecutive we have
      let suffixCount = 0;
      for (let i = simHistory.length - 1; i >= 0; i--) {
        if (simHistory[i].correct && simHistory[i].difficulty === currQuestion.difficulty) {
          suffixCount++;
        } else {
          break;
        }
      }

      if (suffixCount >= 3) {
        if (currQuestion.difficulty === "easy") predictedDiff = "medium";
        else if (currQuestion.difficulty === "medium") predictedDiff = "hard";
        else predictedDiff = "hard";
      } else {
        predictedDiff = currQuestion.difficulty;
      }
    }

    const isBoss = checkIsBossRound(simHistory);

    // Call API in the background to fetch question
    const prefetched = await fetchQuestionFromAPI(predictedDiff, isBoss, askedTexts, askedIds);
    if (prefetched) {
      setNextQuestion(prefetched);
      setNextQuestionDifficulty(predictedDiff);
      setNextQuestionIsBoss(isBoss);
    }
  };

  // Initialize Quiz Session once on mount (or if category changes)
  useEffect(() => {
    const initializeQuiz = async () => {
      setIsLoading(true);
      setLives(3);
      setScore(0);
      setStreak(0);
      setPeakStreak(0);
      setTotalQuestionsAnswered(0);
      setTotalCorrectAnswers(0);
      setCurrentDifficulty("easy");
      setHistory([]);
      setSelectionState("idle");
      setSelectedIdx(null);
      setIsCorrectSelection(null);
      setTimer(30);

      // Clear pre-fetches
      setNextQuestion(null);
      setNextQuestionDifficulty(null);
      setNextQuestionIsBoss(false);

      // Load first question on-demand (difficulty: easy, not boss, empty asked lists)
      const firstQuestion = await fetchQuestionFromAPI("easy", false, [], []);

      if (firstQuestion) {
        setCurrentQuestion(firstQuestion);
        const askedTexts = [firstQuestion.questionText];
        const askedIds = [firstQuestion.id];
        setAlreadyAskedTexts(askedTexts);
        setAlreadyAskedIds(askedIds);

        // Prefetch the next question
        triggerPrefetch(firstQuestion, [], askedTexts, askedIds);
      } else {
        // If we can't even get the first question, finish
        finishQuiz(0, 0, "defeat", 0, 0);
      }
      setIsLoading(false);
    };

    initializeQuiz();

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // Handle countdown Timer
  useEffect(() => {
    if (selectionState === "selected" || !currentQuestion || isLoading) {
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
  }, [currentQuestion, selectionState, isLoading]);

  // Unified logic to process an answer (either select option or timeout)
  const processAnswer = async (correct: boolean, chosenIdx: number | null) => {
    if (selectionState === "selected" || !currentQuestion) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setSelectionState("selected");
    setSelectedIdx(chosenIdx);
    setIsCorrectSelection(correct);

    setTotalQuestionsAnswered((prev) => prev + 1);

    let nextLives = lives;
    let nextScore = score;
    let nextStreak = streak;
    let nextCorrect = totalCorrectAnswers;

    if (correct) {
      nextCorrect += 1;
      setTotalCorrectAnswers(nextCorrect);

      nextStreak += 1;
      setStreak(nextStreak);
      if (nextStreak > peakStreak) {
        setPeakStreak(nextStreak);
      }

      let basePoints = 100;
      if (currentDifficulty === "medium") basePoints = 200;
      if (currentDifficulty === "hard") basePoints = 300;

      const scoredPoints = Math.round(basePoints * (1 + nextStreak * 0.1));
      nextScore += scoredPoints;
      setScore(nextScore);
    } else {
      nextStreak = 0;
      setStreak(0);
      nextLives -= 1;
      setLives(nextLives);
    }

    // Append to actual history
    const newHistoryItem = { correct, difficulty: currentDifficulty };
    const updatedHistory = [...history, newHistoryItem];
    setHistory(updatedHistory);

    // Call Python difficulty engine with actual updated history
    let nextDiff: "easy" | "medium" | "hard" = "easy";
    try {
      const res = await fetch("/api/difficulty-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: updatedHistory }),
      });
      if (!res.ok) {
        throw new Error(`Difficulty engine responded with status ${res.status}`);
      }
      const data = await res.json();
      nextDiff = data.nextDifficulty;
    } catch (e) {
      console.error("Error calling difficulty engine, falling back to client-side logic:", e);
      // Fallback logic
      if (correct) {
        // Count consecutive correct answers of the same tier at the end of updatedHistory
        let suffixCount = 0;
        for (let i = updatedHistory.length - 1; i >= 0; i--) {
          if (updatedHistory[i].correct && updatedHistory[i].difficulty === currentDifficulty) {
            suffixCount++;
          } else {
            break;
          }
        }
        if (suffixCount >= 3) {
          if (currentDifficulty === "easy") nextDiff = "medium";
          else if (currentDifficulty === "medium") nextDiff = "hard";
          else nextDiff = "hard";
        } else {
          nextDiff = currentDifficulty;
        }
      } else {
        if (currentDifficulty === "hard") nextDiff = "medium";
        else nextDiff = "easy";
      }
    }

    // Check if the next question should be a Boss Round
    const nextIsBoss = checkIsBossRound(updatedHistory);

    const isGameOver = nextLives <= 0;
    const isBossVictory = correct && currentQuestion.isBossRound;

    setTimeout(async () => {
      if (isGameOver) {
        const finalOutcome = currentQuestion.isBossRound ? "boss_defeat" : "defeat";
        finishQuiz(nextScore, Math.max(peakStreak, nextStreak), finalOutcome, nextCorrect, totalQuestionsAnswered + 1);
        return;
      }

      if (isBossVictory) {
        finishQuiz(nextScore, Math.max(peakStreak, nextStreak), "boss_victory", nextCorrect, totalQuestionsAnswered + 1);
        return;
      }

      // Transition to next question
      let nextActiveQuestion: Question | null = null;

      const isPreFetchValid =
        nextQuestion !== null &&
        nextQuestionDifficulty === nextDiff &&
        nextQuestionIsBoss === nextIsBoss;

      const currentAskedTexts = [...alreadyAskedTexts];
      const currentAskedIds = [...alreadyAskedIds];

      if (isPreFetchValid && nextQuestion) {
        nextActiveQuestion = nextQuestion;
        currentAskedTexts.push(nextQuestion.questionText);
        currentAskedIds.push(nextQuestion.id);
        setAlreadyAskedTexts(currentAskedTexts);
        setAlreadyAskedIds(currentAskedIds);
      } else {
        // Pre-fetch invalid or mismatched (e.g. they answered wrong so difficulty demoted), fetch on-demand
        setIsLoading(true);
        nextActiveQuestion = await fetchQuestionFromAPI(
          nextDiff,
          nextIsBoss,
          currentAskedTexts,
          currentAskedIds
        );
        setIsLoading(false);

        if (nextActiveQuestion) {
          currentAskedTexts.push(nextActiveQuestion.questionText);
          currentAskedIds.push(nextActiveQuestion.id);
          setAlreadyAskedTexts(currentAskedTexts);
          setAlreadyAskedIds(currentAskedIds);
        }
      }

      if (!nextActiveQuestion) {
        // If we can't obtain a new question, finish the quiz gracefully
        finishQuiz(nextScore, Math.max(peakStreak, nextStreak), "pool_victory", nextCorrect, totalQuestionsAnswered + 1);
        return;
      }

      // Reset state for the next question
      setSelectionState("idle");
      setSelectedIdx(null);
      setIsCorrectSelection(null);
      setCurrentDifficulty(nextDiff);
      setCurrentQuestion(nextActiveQuestion);

      // Reset next question slot
      setNextQuestion(null);
      setNextQuestionDifficulty(null);
      setNextQuestionIsBoss(false);

      // Trigger pre-fetch for the subsequent question
      triggerPrefetch(nextActiveQuestion, updatedHistory, currentAskedTexts, currentAskedIds);
    }, 2000);
  };

  // Define timeout function
  const handleTimeout = () => {
    processAnswer(false, null);
  };

  useEffect(() => {
    handleTimeoutRef.current = handleTimeout;
  });

  const handleOptionSelect = (idx: number) => {
    if (selectionState === "selected" || !currentQuestion) return;
    const correct = idx === currentQuestion.correctAnswerIndex;
    processAnswer(correct, idx);
  };

  // Render Loading state
  if (isLoading || !currentQuestion) {
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
  if (categoryId === "computer-science-fundamentals") categoryLabel = "SYS.FUND";

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
      <div className={`w-full p-8 rounded-lg transition-all duration-300 relative ${
        currentQuestion.isBossRound
          ? "bg-gradient-to-b from-[#150a25] to-bgDark border-2 border-neonViolet shadow-[0_0_25px_rgba(168,85,247,0.3)] animate-pulse"
          : "bg-bgDark border-2 border-neonViolet/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
      }`}>
        {/* Glow corners decoration */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neonCyan"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neonCyan"></div>

        {/* Boss Round Alert Banner */}
        {currentQuestion.isBossRound && (
          <div className="mb-6 bg-neonViolet/20 border border-neonViolet px-4 py-3 rounded text-neonViolet font-mono font-black text-center tracking-widest text-xs md:text-sm shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse">
            ⚠️ WARNING // ULTRA-SECURITY PROTOCOL // BOSS ROUND ACTIVE ⚠️
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-4">
          <span className={`text-xs font-mono tracking-widest px-2.5 py-1 rounded uppercase border ${
            currentQuestion.isBossRound
              ? "text-neonViolet bg-neonViolet/10 border-neonViolet/30"
              : "text-neonCyan bg-neonCyan/10 border-neonCyan/25"
          }`}>
            DIFFICULTY: {currentDifficulty}
          </span>

          {currentQuestion.isBossRound && (
            <span className="text-xs font-mono tracking-widest text-neonViolet bg-neonViolet/10 border border-neonViolet/20 px-2.5 py-1 rounded animate-pulse font-bold">
              ⚠️ BOSS ROUND ⚠️
            </span>
          )}

          <span className="text-xs font-mono tracking-widest text-textMuted font-semibold">
            {totalQuestionsAnswered + 1} OF 10 ESTIMATED
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-6 mb-8 text-textPrimary leading-snug">
          {currentQuestion.questionText}
        </h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option: string, idx: number) => {
            const letters = ["A", "B", "C", "D"];

            // Selection feedback styles
            let borderClass = currentQuestion.isBossRound
              ? "border-neonViolet/30 hover:border-neonViolet hover:bg-neonViolet/10"
              : "border-neonViolet/20 hover:border-neonCyan hover:bg-neonCyan/5";
            let letterBgClass = currentQuestion.isBossRound
              ? "bg-neonViolet/15 group-hover:bg-neonViolet/35 border-neonViolet/40 group-hover:border-neonViolet text-neonViolet"
              : "bg-neonViolet/10 group-hover:bg-neonCyan/20 border-neonViolet/30 group-hover:border-neonCyan text-neonViolet group-hover:text-neonCyan";
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

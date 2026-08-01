"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { Question } from "../../lib/questions";
import SystemLogLoader from "../../components/SystemLogLoader";

const parseCategoryInfo = (id: string) => {
  if (id.startsWith("programming_")) {
    const parts = id.split("_");
    const langRaw = parts[1] || "";
    const diffRaw = parts[2] || "";

    const langMapping: Record<string, string> = {
      python: "Python",
      java: "Java",
      javascript: "JavaScript",
      c: "C",
      cpp: "C++",
      csharp: "C#",
      php: "PHP",
      typescript: "TypeScript",
      go: "Go",
      rust: "Rust",
      kotlin: "Kotlin",
      swift: "Swift",
    };

    const formattedLang = langMapping[langRaw.toLowerCase()] || langRaw.toUpperCase();
    const formattedDiff = diffRaw.charAt(0).toUpperCase() + diffRaw.slice(1);

    return {
      isExtendedProgramming: true,
      language: langRaw,
      difficulty: diffRaw as "easy" | "medium" | "hard" | "impossible",
      label: "SYS.LANG",
      displayName: `Programming: ${formattedLang} (${formattedDiff})`
    };
  }

  if (id.startsWith("business_")) {
    const parts = id.split("_");
    const subRaw = parts[1] || "";
    const diffRaw = parts[2] || "";

    const subMapping: Record<string, string> = {
      marketing: "Marketing",
      finance: "Finance",
      accounting: "Accounting",
      entrepreneurship: "Entrepreneurship",
      management: "Management",
      economics: "Economics",
      "business-strategy": "Business Strategy",
    };

    const formattedSub = subMapping[subRaw.toLowerCase()] || subRaw.toUpperCase();
    const formattedDiff = diffRaw.charAt(0).toUpperCase() + diffRaw.slice(1);

    return {
      isExtendedProgramming: true,
      language: subRaw,
      difficulty: diffRaw as "easy" | "medium" | "hard" | "impossible",
      label: "BUS.MGMT",
      displayName: `Business: ${formattedSub} (${formattedDiff})`
    };
  }

  if (id.startsWith("english_")) {
    const parts = id.split("_");
    const subRaw = parts[1] || "";
    const diffRaw = parts[2] || "";

    const subMapping: Record<string, string> = {
      grammar: "Grammar",
      vocabulary: "Vocabulary",
      "synonyms-antonyms": "Synonyms & Antonyms",
      tenses: "Tenses",
      "sentence-correction": "Sentence Correction",
      "idioms-phrases": "Idioms & Phrases",
      "reading-comprehension": "Reading Comprehension",
    };

    const formattedSub = subMapping[subRaw.toLowerCase()] || subRaw.toUpperCase();
    const formattedDiff = diffRaw.charAt(0).toUpperCase() + diffRaw.slice(1);

    return {
      isExtendedProgramming: true,
      language: subRaw,
      difficulty: diffRaw as "easy" | "medium" | "hard" | "impossible",
      label: "ENG.LANG",
      displayName: `English: ${formattedSub} (${formattedDiff})`
    };
  }

  const labelMap: Record<string, string> = {
    programming: "SYS.LANG",
    "logic-algorithms": "ALG.COMP",
    "data-analytics": "DAT.SCALE",
    "computer-science-fundamentals": "SYS.CORE",
  };

  return {
    isExtendedProgramming: false,
    language: "",
    difficulty: "easy" as const,
    label: labelMap[id] || "SYS.CORE",
    displayName: id.replace("-", " ")
  };
};

const AI_STATUS_LINES = [
  "> ANALYZING PATTERN...",
  "> CROSS-REFERENCING DATABASE...",
  "> COMPILING RESPONSE...",
  "> RUNNING COGNITIVE SIMULATION...",
  "> INTERCEPTING DATA STREAM...",
  "> PARSING SYNTAX TREE...",
];

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected Category ID
  const categoryId = searchParams.get("category") || "programming";
  const catInfo = parseCategoryInfo(categoryId);

  // States
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [peakStreak, setPeakStreak] = useState<number>(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState<number>(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);

  // AI Twin States
  const [isAiTwinActive, setIsAiTwinActive] = useState<boolean>(false);
  const [aiScore, setAiScore] = useState<number>(0);
  const [aiStreak, setAiStreak] = useState<number>(0);
  const [aiPeakStreak, setAiPeakStreak] = useState<number>(0);
  const [aiState, setAiState] = useState<"thinking" | "locked_in" | "answered">("thinking");
  const [aiStatusText, setAiStatusText] = useState<string>("> INITIALIZING COGNITIVE CORE...");

  // AI Twin Refs
  const aiWillBeCorrectRef = useRef<boolean>(false);
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const aiStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Difficulty States & History
  const [currentDifficulty, setCurrentDifficulty] = useState<"easy" | "medium" | "hard" | "impossible">("easy");
  const [history, setHistory] = useState<{ correct: boolean; difficulty: "easy" | "medium" | "hard" | "impossible" }[]>([]);
  const [alreadyAskedTexts, setAlreadyAskedTexts] = useState<string[]>([]);
  const [alreadyAskedIds, setAlreadyAskedIds] = useState<string[]>([]);

  // Current active question & Pre-fetched question
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
  const [nextQuestionDifficulty, setNextQuestionDifficulty] = useState<"easy" | "medium" | "hard" | "impossible" | null>(null);
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

  // Helper to save session state to sessionStorage
  const saveSessionState = (
    currentLives: number,
    currentScore: number,
    currentStreak: number,
    currentPeakStreak: number,
    answered: number,
    correct: number,
    diff: "easy" | "medium" | "hard" | "impossible",
    hist: { correct: boolean; difficulty: "easy" | "medium" | "hard" | "impossible" }[],
    askedTexts: string[],
    askedIds: string[],
    currQuestion: Question | null,
    twinActive: boolean,
    twinScore: number,
    twinStreak: number,
    twinPeakStreak: number
  ) => {
    try {
      const stateObj = {
        categoryId,
        lives: currentLives,
        score: currentScore,
        streak: currentStreak,
        peakStreak: currentPeakStreak,
        totalQuestionsAnswered: answered,
        totalCorrectAnswers: correct,
        currentDifficulty: diff,
        history: hist,
        alreadyAskedTexts: askedTexts,
        alreadyAskedIds: askedIds,
        currentQuestion: currQuestion,
        isAiTwinActive: twinActive,
        aiScore: twinScore,
        aiStreak: twinStreak,
        aiPeakStreak: twinPeakStreak,
      };
      const sessionKey = categoryId.startsWith("programming_") || categoryId.startsWith("business_") || categoryId.startsWith("english_")
        ? `active_quiz_session_${categoryId}`
        : "active_quiz_session";
      sessionStorage.setItem(sessionKey, JSON.stringify(stateObj));
    } catch (e) {
      console.error("Failed to save quiz session:", e);
    }
  };

  // Helper to clear session state from sessionStorage
  const clearSessionState = () => {
    try {
      const sessionKey = categoryId.startsWith("programming_") || categoryId.startsWith("business_") || categoryId.startsWith("english_")
        ? `active_quiz_session_${categoryId}`
        : "active_quiz_session";
      sessionStorage.removeItem(sessionKey);
    } catch (e) {
      console.error("Failed to clear quiz session:", e);
    }
  };

  // Helper to check if the simulated/actual history should trigger a Boss Round
  const checkIsBossRound = (hist: { correct: boolean; difficulty: "easy" | "medium" | "hard" | "impossible" }[]): boolean => {
    if (hist.length < 3) return false;
    const last3 = hist.slice(-3);
    return last3.every((h) => h.correct && h.difficulty === "hard");
  };

  // Helper to fetch a question from our Next.js API Route
  const fetchQuestionFromAPI = async (
    diff: "easy" | "medium" | "hard" | "impossible",
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
    total: number,
    twinActive = false,
    twinScore = 0,
    twinStreak = 0
  ) => {
    clearSessionState();
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const resultState = {
      score: finalScore,
      peakStreak: finalPeakStreak,
      category: categoryId,
      outcome,
      accuracy,
      correct,
      total,
      aiTwinEnabled: twinActive,
      aiScore: twinScore,
      aiStreak: twinStreak,
    };
    sessionStorage.setItem("impossible_quiz_result", JSON.stringify(resultState));

    // Construct search parameters for link sharing
    let shareUrl = `/results?category=${categoryId}&score=${finalScore}&streak=${finalPeakStreak}&outcome=${outcome}`;
    if (twinActive) {
      shareUrl += `&aiTwin=true&aiScore=${twinScore}&aiStreak=${twinStreak}`;
    }
    router.push(shareUrl);
  };

  // Helper to trigger optimistic pre-fetching for the subsequent question
  const triggerPrefetch = async (
    currQuestion: Question,
    currHistory: { correct: boolean; difficulty: "easy" | "medium" | "hard" | "impossible" }[],
    askedTexts: string[],
    askedIds: string[]
  ) => {
    // For Impossible difficulty, always maintain Impossible, no engine call
    if (currQuestion.difficulty === "impossible") {
      const isBoss = false;
      const prefetched = await fetchQuestionFromAPI("impossible", isBoss, askedTexts, askedIds);
      if (prefetched) {
        setNextQuestion(prefetched);
        setNextQuestionDifficulty("impossible");
        setNextQuestionIsBoss(isBoss);
      }
      return;
    }

    // Optimistic prediction: assume player gets the current question correct
    const simHistory = [...currHistory, { correct: true, difficulty: currQuestion.difficulty as "easy" | "medium" | "hard" }];

    let predictedDiff: "easy" | "medium" | "hard" | "impossible" = "easy";
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
        predictedDiff = currQuestion.difficulty as "easy" | "medium" | "hard";
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

      const sessionKey = categoryId.startsWith("programming_") || categoryId.startsWith("business_") || categoryId.startsWith("english_")
        ? `active_quiz_session_${categoryId}`
        : "active_quiz_session";

      // Try to restore session state from sessionStorage
      let restored = null;
      try {
        const stored = sessionStorage.getItem(sessionKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.categoryId === categoryId) {
            restored = parsed;
          }
        }
      } catch (e) {
        console.error("Failed to restore quiz session:", e);
      }

      if (restored) {
        setLives(restored.lives);
        setScore(restored.score);
        setStreak(restored.streak);
        setPeakStreak(restored.peakStreak);
        setTotalQuestionsAnswered(restored.totalQuestionsAnswered);
        setTotalCorrectAnswers(restored.totalCorrectAnswers);
        setCurrentDifficulty(restored.currentDifficulty);
        setHistory(restored.history);
        setAlreadyAskedTexts(restored.alreadyAskedTexts);
        setAlreadyAskedIds(restored.alreadyAskedIds);
        setCurrentQuestion(restored.currentQuestion);

        // Restore AI stats
        const activeAi = restored.isAiTwinActive || false;
        setIsAiTwinActive(activeAi);
        setAiScore(restored.aiScore || 0);
        setAiStreak(restored.aiStreak || 0);
        setAiPeakStreak(restored.aiPeakStreak || 0);

        // Pre-clear old next-question prefetch slots
        setNextQuestion(null);
        setNextQuestionDifficulty(null);
        setNextQuestionIsBoss(false);

        // Warm up prefetch for restored state
        if (restored.currentQuestion) {
          triggerPrefetch(restored.currentQuestion, restored.history, restored.alreadyAskedTexts, restored.alreadyAskedIds);
        }
        setIsLoading(false);
        return;
      }

      const startingDiff = catInfo.isExtendedProgramming ? catInfo.difficulty : "easy";
      const startingLives = startingDiff === "impossible" ? 1 : 3;
      const initialTimer = startingDiff === "impossible" ? 15 : 30;

      // Check query parameter for AI Twin
      const initialAiActive = searchParams.get("aiTwin") === "true";
      setIsAiTwinActive(initialAiActive);
      setAiScore(0);
      setAiStreak(0);
      setAiPeakStreak(0);
      setAiState("thinking");
      setAiStatusText("> INITIALIZING COGNITIVE CORE...");

      // Standard clean initialization
      setLives(startingLives);
      setScore(0);
      setStreak(0);
      setPeakStreak(0);
      setTotalQuestionsAnswered(0);
      setTotalCorrectAnswers(0);
      setCurrentDifficulty(startingDiff);
      setHistory([]);
      setSelectionState("idle");
      setSelectedIdx(null);
      setIsCorrectSelection(null);
      setTimer(initialTimer);

      // Clear pre-fetches
      setNextQuestion(null);
      setNextQuestionDifficulty(null);
      setNextQuestionIsBoss(false);

      // Load first question on-demand (difficulty: startingDiff, not boss, empty asked lists)
      const firstQuestion = await fetchQuestionFromAPI(startingDiff, false, [], []);

      if (firstQuestion) {
        setCurrentQuestion(firstQuestion);
        const askedTexts = [firstQuestion.questionText];
        const askedIds = [firstQuestion.id];
        setAlreadyAskedTexts(askedTexts);
        setAlreadyAskedIds(askedIds);

        // Save session immediately
        saveSessionState(
          startingLives,
          0,
          0,
          0,
          0,
          0,
          startingDiff,
          [],
          askedTexts,
          askedIds,
          firstQuestion,
          initialAiActive,
          0,
          0,
          0
        );

        // Prefetch the next question
        triggerPrefetch(firstQuestion, [], askedTexts, askedIds);
      } else {
        finishQuiz(0, 0, "defeat", 0, 0, initialAiActive, 0, 0);
      }
      setIsLoading(false);
    };

    initializeQuiz();

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      if (aiStatusIntervalRef.current) clearInterval(aiStatusIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // Handle countdown Timer
  useEffect(() => {
    if (selectionState === "selected" || !currentQuestion || isLoading) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    const initialTimer = currentDifficulty === "impossible" ? 15 : 30;
    setTimer(initialTimer);
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
  }, [currentQuestion, selectionState, isLoading, currentDifficulty]);

  // Start Simulated AI Twin turn
  const startAiTwinTurn = (difficulty: "easy" | "medium" | "hard" | "impossible") => {
    if (!isAiTwinActive) return;

    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    if (aiStatusIntervalRef.current) clearInterval(aiStatusIntervalRef.current);

    setAiState("thinking");

    // 1. Determine correctness weighted by difficulty
    // Easy: 85%, Medium: 65%, Hard: 45%, Impossible: 25%
    let prob = 0.85;
    if (difficulty === "medium") prob = 0.65;
    else if (difficulty === "hard") prob = 0.45;
    else if (difficulty === "impossible") prob = 0.25;

    const willBeCorrect = Math.random() < prob;
    aiWillBeCorrectRef.current = willBeCorrect;

    // 2. Select initial status
    const initialLine = AI_STATUS_LINES[Math.floor(Math.random() * AI_STATUS_LINES.length)];
    setAiStatusText(initialLine);

    // 3. Rotate status lines
    let statusIndex = 0;
    aiStatusIntervalRef.current = setInterval(() => {
      statusIndex = (statusIndex + 1) % AI_STATUS_LINES.length;
      setAiStatusText(AI_STATUS_LINES[statusIndex]);
    }, 1500);

    // 4. Thinking delay: 2-8 seconds
    const delay = Math.floor(Math.random() * 6000) + 2000;

    aiTimerRef.current = setTimeout(() => {
      if (aiStatusIntervalRef.current) clearInterval(aiStatusIntervalRef.current);
      setAiState("locked_in");
      setAiStatusText("> RESPONSE COMPILED // LOCKED IN");
    }, delay);
  };

  useEffect(() => {
    if (currentQuestion && isAiTwinActive && selectionState === "idle") {
      startAiTwinTurn(currentDifficulty);
    }
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      if (aiStatusIntervalRef.current) clearInterval(aiStatusIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, isAiTwinActive, currentDifficulty, selectionState]);

  // Unified logic to process an answer (either select option or timeout)
  const processAnswer = async (correct: boolean, chosenIdx: number | null) => {
    if (selectionState === "selected" || !currentQuestion) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    // Clear AI Twin compilation timers immediately
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    if (aiStatusIntervalRef.current) clearInterval(aiStatusIntervalRef.current);

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
      if (currentDifficulty === "impossible") basePoints = 500;

      const scoredPoints = Math.round(basePoints * (1 + nextStreak * 0.1));
      nextScore += scoredPoints;
      setScore(nextScore);
    } else {
      nextStreak = 0;
      setStreak(0);
      nextLives -= 1;
      setLives(nextLives);
    }

    // AI Twin Resolution
    let nextAiScore = aiScore;
    let nextAiStreak = aiStreak;
    let nextAiPeakStreak = aiPeakStreak;

    if (isAiTwinActive) {
      const aiCorrect = aiWillBeCorrectRef.current;
      setAiState("answered");

      if (aiCorrect) {
        nextAiStreak += 1;
        if (nextAiStreak > nextAiPeakStreak) {
          nextAiPeakStreak = nextAiStreak;
          setAiPeakStreak(nextAiPeakStreak);
        }
        setAiStreak(nextAiStreak);

        let basePoints = 100;
        if (currentDifficulty === "medium") basePoints = 200;
        if (currentDifficulty === "hard") basePoints = 300;
        if (currentDifficulty === "impossible") basePoints = 500;

        const aiScoredPoints = Math.round(basePoints * (1 + nextAiStreak * 0.1));
        nextAiScore += aiScoredPoints;
        setAiScore(nextAiScore);

        setAiStatusText(`> CORRECT // SECURED +${aiScoredPoints} PTS`);
      } else {
        nextAiStreak = 0;
        setAiStreak(0);
        setAiStatusText("> INCORRECT // ACCESS DENIED");
      }
    }

    // Append to actual history
    const newHistoryItem = { correct, difficulty: currentDifficulty };
    const updatedHistory = [...history, newHistoryItem];
    setHistory(updatedHistory);

    // Call Python difficulty engine with actual updated history
    let nextDiff: "easy" | "medium" | "hard" | "impossible" = "easy";
    if (currentDifficulty === "impossible") {
      nextDiff = "impossible";
    } else {
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
            nextDiff = currentDifficulty as "easy" | "medium" | "hard";
          }
        } else {
          if (currentDifficulty === "hard") nextDiff = "medium";
          else nextDiff = "easy";
        }
      }
    }

    // Check if the next question should be a Boss Round
    const nextIsBoss = currentDifficulty === "impossible" ? false : checkIsBossRound(updatedHistory);

    const isGameOver = nextLives <= 0;
    const isBossVictory = correct && (currentQuestion.isBossRound || (currentDifficulty === "impossible" && totalQuestionsAnswered + 1 >= 10));

    setTimeout(async () => {
      if (isGameOver) {
        const finalOutcome = currentQuestion.isBossRound ? "boss_defeat" : "defeat";
        finishQuiz(
          nextScore,
          Math.max(peakStreak, nextStreak),
          finalOutcome,
          nextCorrect,
          totalQuestionsAnswered + 1,
          isAiTwinActive,
          nextAiScore,
          nextAiPeakStreak
        );
        return;
      }

      if (isBossVictory) {
        finishQuiz(
          nextScore,
          Math.max(peakStreak, nextStreak),
          "boss_victory",
          nextCorrect,
          totalQuestionsAnswered + 1,
          isAiTwinActive,
          nextAiScore,
          nextAiPeakStreak
        );
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
        finishQuiz(
          nextScore,
          Math.max(peakStreak, nextStreak),
          "pool_victory",
          nextCorrect,
          totalQuestionsAnswered + 1,
          isAiTwinActive,
          nextAiScore,
          nextAiPeakStreak
        );
        return;
      }

      // Save persistent state immediately for the next question
      saveSessionState(
        nextLives,
        nextScore,
        nextStreak,
        Math.max(peakStreak, nextStreak),
        totalQuestionsAnswered + 1,
        nextCorrect,
        nextDiff,
        updatedHistory,
        currentAskedTexts,
        currentAskedIds,
        nextActiveQuestion,
        isAiTwinActive,
        nextAiScore,
        nextAiStreak,
        nextAiPeakStreak
      );

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
        <SystemLogLoader context="quiz" />
      </div>
    );
  }

  // Set category label
  const categoryLabel = catInfo.label;
  const categoryDisplayName = catInfo.displayName;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-12 max-w-4xl mx-auto w-full select-none animate-page-fade">
      {/* Category header details */}
      <div className="w-full text-center md:text-left mb-6 flex justify-between items-center border-b border-neonViolet/15 pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-display tracking-widest text-textMuted uppercase">CURRENT SIMULATION</span>
          <span className="text-sm font-black text-neonCyan font-display uppercase tracking-wider">
            {categoryDisplayName} {" // "} {categoryLabel}
          </span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] font-display tracking-widest text-textMuted block uppercase mb-1">TIMER</span>
            <span className={`text-sm font-black font-display transition-colors duration-200 ${timer <= 5 ? "text-neonViolet animate-pulse" : "text-neonCyan"}`}>
              {timer < 10 ? `00:0${timer}` : `00:${timer}`}
            </span>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${timer <= 5 ? "bg-neonViolet animate-ping" : "bg-neonCyan"}`}></div>
        </div>
      </div>

      {/* Dynamic HUD Grid: Side-by-Side if AI Twin is enabled */}
      {isAiTwinActive ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Player HUD */}
          <div className="p-4 rounded bg-bgDark border-2 border-neonCyan/40 flex flex-col justify-between gap-3 relative overflow-hidden shadow-[inset_0_0_8px_rgba(34,211,238,0.05)]">
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-neonCyan"></div>
            <div className="flex justify-between items-center select-none font-display">
              <span className="text-[10px] tracking-widest text-neonCyan font-black uppercase">PLAYER_HUD // ONLINE</span>
              <span className="text-[9px] tracking-widest text-textMuted uppercase">01</span>
            </div>
            <div className="flex justify-between items-center">
              {/* Shields */}
              <div className="flex flex-col items-start select-none font-display">
                <span className="text-[9px] tracking-widest text-textMuted uppercase mb-1">SHIELD</span>
                <div className="flex gap-1">
                  {Array.from({ length: currentDifficulty === "impossible" ? 1 : 3 }).map((_, idx) => {
                    const heart = idx + 1;
                    return (
                      <span
                        key={heart}
                        className={`text-base transition-all duration-300 ${
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
              <div className="flex flex-col items-center select-none font-display">
                <span className="text-[9px] tracking-widest text-textMuted uppercase mb-1">STREAK</span>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-black text-neonViolet font-display ${streak > 0 ? "animate-streak-pulse" : ""}`}>
                    {streak}
                  </span>
                  <span className={`text-sm transition-transform duration-300 ${streak > 0 ? "scale-110" : "opacity-35"}`}>
                    🔥
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-end font-display">
                <span className="text-[9px] tracking-widest text-textMuted uppercase mb-1">SCORE</span>
                <span className="text-sm font-black text-neonCyan">{score.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* AI Twin HUD */}
          <div className="p-4 rounded bg-bgDark border-2 border-neonViolet flex flex-col justify-between gap-3 relative overflow-hidden shadow-[inset_0_0_8px_rgba(168,85,247,0.05),0_0_15px_rgba(168,85,247,0.1)]">
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-neonViolet"></div>
            <div className="flex justify-between items-center select-none font-display">
              <span className="text-[10px] tracking-widest text-neonViolet font-black uppercase">AI_TWIN_HUD // ACTIVE</span>
              <span className="text-[9px] tracking-widest text-textMuted uppercase">02</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              {/* Status */}
              <div className="flex-1 flex flex-col items-start min-w-[50%]">
                <span className="text-[9px] font-display tracking-widest text-textMuted uppercase mb-1">AI STATUS</span>
                <span className={`text-[10px] font-mono font-bold truncate transition-colors duration-300 ${
                  aiState === "thinking" ? "text-neonViolet" : aiStatusText.includes("CORRECT") ? "text-neonCyan animate-pulse" : "text-neonViolet animate-pulse"
                }`}>
                  {aiStatusText}
                </span>
              </div>

              {/* Streak */}
              <div className="flex flex-col items-center select-none font-display">
                <span className="text-[9px] tracking-widest text-textMuted uppercase mb-1">STREAK</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-neonViolet">{aiStreak}</span>
                  <span className="text-sm">🔥</span>
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-end font-display">
                <span className="text-[9px] tracking-widest text-textMuted uppercase mb-1">SCORE</span>
                <span className="text-sm font-black text-neonCyan">{aiScore.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Original Metrics Bar (Single column layout) */
        <div className="w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 border-b border-neonViolet/20 pb-4">
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto">
            {/* Shields */}
            <div className="flex flex-col items-start md:items-end">
              <span className="text-[10px] font-display tracking-widest text-textMuted uppercase mb-1">SHIELD</span>
              <div className="flex gap-1">
                {Array.from({ length: currentDifficulty === "impossible" ? 1 : 3 }).map((_, idx) => {
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
                <span
                  key={streak}
                  className={`text-sm font-black text-neonViolet font-display ${streak > 0 ? "animate-streak-pulse" : ""}`}
                >
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
          </div>
        </div>
      )}

      {/* Timer Bar */}
      <div className="w-full h-1 bg-bgDark border border-neonViolet/20 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${timer <= 5 ? "bg-neonViolet" : "bg-gradient-to-r from-neonCyan to-neonViolet"}`}
          style={{ width: `${(timer / (currentDifficulty === "impossible" ? 15 : 30)) * 100}%` }}
        ></div>
      </div>

      {/* Main Question Display */}
      <div className={`w-full p-6 md:p-8 rounded-lg transition-all duration-300 relative ${
        currentQuestion.isBossRound
          ? "bg-gradient-to-b from-[#150a25] to-bgDark border-2 border-neonViolet shadow-[0_0_25px_rgba(168,85,247,0.3)] animate-pulse"
          : "bg-bgDark border-2 border-neonViolet/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
      }`}>
        {/* Glow corners decoration */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neonCyan"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neonCyan"></div>

        {/* Boss Round Alert Banner */}
        {currentQuestion.isBossRound && (
          <div className="mb-6 bg-neonViolet/20 border border-neonViolet px-4 py-3 rounded text-neonViolet font-display font-black text-center tracking-widest text-xs md:text-sm shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse">
            ⚠️ WARNING // ULTRA-SECURITY PROTOCOL // BOSS ROUND ACTIVE ⚠️
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-4">
          <span className={`text-[10px] font-display tracking-widest px-2.5 py-1 rounded uppercase border ${
            currentQuestion.isBossRound
              ? "text-neonViolet bg-neonViolet/10 border-neonViolet/30"
              : "text-neonCyan bg-neonCyan/10 border-neonCyan/25"
          }`}>
            DIFFICULTY: {currentDifficulty}
          </span>

          <div className="flex items-center gap-2">
            {isAiTwinActive && (
              <span className={`text-[10px] font-display tracking-widest border px-2 py-0.5 rounded font-bold uppercase transition-all duration-300 ${
                aiState === "thinking"
                  ? "text-neonViolet bg-neonViolet/10 border-neonViolet/25 animate-pulse"
                  : "text-neonCyan bg-neonCyan/10 border-neonCyan/25 shadow-[0_0_8px_rgba(34,211,238,0.3)] font-black"
              }`}>
                {aiState === "thinking" ? "🤖 AI TWIN: THINKING" : "🤖 AI TWIN: LOCKED IN"}
              </span>
            )}

            {currentQuestion.isBossRound && (
              <span className="text-[10px] font-display tracking-widest text-neonViolet bg-neonViolet/10 border border-neonViolet/20 px-2.5 py-1 rounded animate-pulse font-bold">
                ⚠️ BOSS ROUND ⚠️
              </span>
            )}
          </div>

          <span className="text-[10px] font-display tracking-widest text-textMuted font-bold uppercase">
            {totalQuestionsAnswered + 1} OF 10 ESTIMATED
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
      <div className="w-full flex justify-between items-center mt-6">
        <Link
          href={`/categories?aiTwin=${isAiTwinActive}`}
          onClick={clearSessionState}
          className="text-xs font-display tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5 focus:outline-none focus:ring-1 focus:ring-neonViolet"
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
        <SystemLogLoader context="quiz" />
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}

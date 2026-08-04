"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import html2canvas from "html2canvas";
import {
  evaluateQuizAchievements,
  calculateQuizXP,
  addXP,
  Achievement,
} from "../../lib/achievements";

interface QuizResult {
  score: number;
  peakStreak: number;
  category: string;
  outcome: "boss_victory" | "pool_victory" | "defeat" | "boss_defeat";
  accuracy: number;
  correct: number;
  total: number;
  timeTaken?: number; // total quiz time in seconds
  evaluated?: boolean; // prevent multiple XP / achievement logs on refresh
  submitted?: boolean;
  submittedId?: string;
  nickname?: string;
  aiTwinEnabled?: boolean;
  aiScore?: number;
  aiStreak?: number;
}

const KNOWN_CATEGORIES = [
  "programming",
  "logic-algorithms",
  "data-analytics",
  "computer-science-fundamentals",
];

const KNOWN_OUTCOMES = ["boss_victory", "pool_victory", "boss_defeat", "defeat"];

const formatCategoryName = (id: string): string => {
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

    return `Programming: ${formattedLang} (${formattedDiff})`;
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

    return `Business: ${formattedSub} (${formattedDiff})`;
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

    return `English: ${formattedSub} (${formattedDiff})`;
  }

  const categoryLabels: Record<string, string> = {
    programming: "Programming // SYS.LANG",
    "logic-algorithms": "Logic/Algorithms // ALG.COMP",
    "data-analytics": "Data Analytics // DAT.SCALE",
    "computer-science-fundamentals": "Computer Science Fundamentals // SYS.CORE",
  };
  return categoryLabels[id] || id.toUpperCase();
};

const sanitizeNickname = (input: string): string => {
  let cleaned = input.replace(/<\/?[^>]+(>|$)/g, "");
  cleaned = cleaned.replace(/[<>]/g, "");
  return cleaned.trim();
};

export default function ResultsClient() {
  const [sessionResult, setSessionResult] = useState<QuizResult | null>(null);
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Stats / Personal Best states
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [xpGained, setXpGained] = useState<number>(0);

  // Animated score race bar states
  const [raceProgress, setRaceProgress] = useState<number>(0);

  // Active toast triggers for newly unlocked achievements
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [currentToast, setCurrentToast] = useState<Achievement | null>(null);

  const searchParams = useSearchParams();

  // Handle sequential toast queue
  useEffect(() => {
    if (toastQueue.length > 0 && !currentToast) {
      const next = toastQueue[0];
      setCurrentToast(next);
      setToastQueue((prev) => prev.slice(1));
    }
  }, [toastQueue, currentToast]);

  useEffect(() => {
    if (currentToast) {
      const timer = setTimeout(() => {
        setCurrentToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentToast]);


  // Try to load sessionStorage results and evaluate achievements on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("impossible_quiz_result");
      if (stored) {
        const parsed: QuizResult = JSON.parse(stored);
        setSessionResult(parsed);

        // Personal Best logic (Category + Difficulty unique key)
        const pbKey = `pb_${parsed.category}`;
        const storedPBs = sessionStorage.getItem("quiz_personal_bests");
        const pbs = storedPBs ? JSON.parse(storedPBs) : {};
        const previousBest = pbs[pbKey] || 0;

        if (parsed.score > previousBest) {
          pbs[pbKey] = parsed.score;
          sessionStorage.setItem("quiz_personal_bests", JSON.stringify(pbs));
          setPersonalBest(parsed.score);
          if (previousBest > 0) {
            setIsNewBest(true);
          }
        } else {
          setPersonalBest(previousBest);
        }

        // Evaluate achievements & XP only once per attempt
        if (!parsed.evaluated) {
          const calculatedXp = calculateQuizXP({
            score: parsed.score,
            peakStreak: parsed.peakStreak,
            category: parsed.category,
            outcome: parsed.outcome,
            accuracy: parsed.accuracy || 0,
            correct: parsed.correct || 0,
            total: parsed.total || 0,
          });

          setXpGained(calculatedXp);
          const nextXpTotal = addXP(calculatedXp);

          const newlyUnlocked = evaluateQuizAchievements(
            {
              score: parsed.score,
              peakStreak: parsed.peakStreak,
              category: parsed.category,
              outcome: parsed.outcome,
              accuracy: parsed.accuracy || 0,
              correct: parsed.correct || 0,
              total: parsed.total || 0,
              aiTwinEnabled: parsed.aiTwinEnabled,
              aiScore: parsed.aiScore,
              aiStreak: parsed.aiStreak,
            },
            nextXpTotal
          );

          if (newlyUnlocked.length > 0) {
            setToastQueue((prev) => [...prev, ...newlyUnlocked]);
          }

          // -------------------------------------------------------------
          // Save lifetime stats to local storage for the Profile Page
          // -------------------------------------------------------------
          try {
            const statsStr = localStorage.getItem("impossible_quiz_player_stats");
            const stats = statsStr ? JSON.parse(statsStr) : {
              totalQuizzesPlayed: 0,
              totalCorrectAnswers: 0,
              totalQuestionsAnswered: 0,
              aiTwinWins: 0,
              aiTwinLosses: 0,
              aiTwinTies: 0,
              categoryPlayCounts: {} as Record<string, number>,
            };

            stats.totalQuizzesPlayed += 1;
            stats.totalCorrectAnswers += (parsed.correct || 0);
            stats.totalQuestionsAnswered += (parsed.total || 0);

            // Track category play counts
            const cat = parsed.category || "programming";
            stats.categoryPlayCounts[cat] = (stats.categoryPlayCounts[cat] || 0) + 1;

            // Track AI Twin outcomes
            if (parsed.aiTwinEnabled) {
              if (parsed.score > (parsed.aiScore || 0)) {
                stats.aiTwinWins += 1;
              } else if (parsed.score < (parsed.aiScore || 0)) {
                stats.aiTwinLosses += 1;
              } else {
                stats.aiTwinTies += 1;
              }
            }

            localStorage.setItem("impossible_quiz_player_stats", JSON.stringify(stats));
          } catch (err) {
            console.error("Failed to update profile stats in localStorage:", err);
          }

          // Save evaluation flag
          const updated = { ...parsed, evaluated: true };
          sessionStorage.setItem("impossible_quiz_result", JSON.stringify(updated));
          setSessionResult(updated);
        }
      }
    } catch (e) {
      console.error("Failed to read quiz result from sessionStorage:", e);
    }
  }, []);

  // Parse and sanitize query parameters with safety boundaries (For link sharing)
  const queryResult = useMemo<QuizResult | null>(() => {
    const pScore = searchParams.get("score");
    const pStreak = searchParams.get("streak");
    const pCategory = searchParams.get("category");
    const pOutcome = searchParams.get("outcome");
    const pAiTwin = searchParams.get("aiTwin");
    const pAiScore = searchParams.get("aiScore");
    const pAiStreak = searchParams.get("aiStreak");
    const pTime = searchParams.get("time");

    if (!pScore && !pCategory && !pOutcome) {
      return null;
    }

    // Sanitize Score
    let score = parseInt(pScore || "0", 10);
    if (isNaN(score) || score < 0) score = 0;
    if (score > 1000000) score = 1000000;

    // Sanitize Streak
    let peakStreak = parseInt(pStreak || "0", 10);
    if (isNaN(peakStreak) || peakStreak < 0) peakStreak = 0;
    if (peakStreak > 100) peakStreak = 100;

    // Sanitize Category
    let category = pCategory || "programming";
    if (
      !KNOWN_CATEGORIES.includes(category) &&
      !category.startsWith("programming_") &&
      !category.startsWith("business_") &&
      !category.startsWith("english_")
    ) {
      category = "programming";
    }

    // Sanitize Outcome
    let outcome: QuizResult["outcome"] = "defeat";
    if (pOutcome && KNOWN_OUTCOMES.includes(pOutcome)) {
      outcome = pOutcome as QuizResult["outcome"];
    }

    // Sanitize AI parameters
    const aiTwinEnabled = pAiTwin === "true";
    let aiScore = 0;
    if (pAiScore) {
      aiScore = parseInt(pAiScore, 10);
      if (isNaN(aiScore) || aiScore < 0) aiScore = 0;
    }
    let aiStreak = 0;
    if (pAiStreak) {
      aiStreak = parseInt(pAiStreak, 10);
      if (isNaN(aiStreak) || aiStreak < 0) aiStreak = 0;
    }

    // Sanitize Time
    let timeTaken = 0;
    if (pTime) {
      timeTaken = parseInt(pTime, 10);
      if (isNaN(timeTaken) || timeTaken < 0) timeTaken = 0;
    }

    return {
      score,
      peakStreak,
      category,
      outcome,
      accuracy: 100, // standard display placeholder for shared links
      correct: 10,
      total: 10,
      timeTaken,
      aiTwinEnabled,
      aiScore,
      aiStreak,
    };
  }, [searchParams]);

  // Merge: Query params take precedence if present and valid (for public link sharing)
  const activeResult: QuizResult = useMemo(() => {
    return queryResult || sessionResult || {
      score: 0,
      peakStreak: 0,
      category: "programming",
      outcome: "defeat",
      accuracy: 0,
      correct: 0,
      total: 0,
      timeTaken: 0,
      aiTwinEnabled: false,
      aiScore: 0,
      aiStreak: 0,
    };
  }, [queryResult, sessionResult]);

  // Trigger race bar animation after results load
  useEffect(() => {
    if (activeResult.aiTwinEnabled) {
      setRaceProgress(0);
      const timer = setTimeout(() => {
        setRaceProgress(1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeResult]);

  const isVictory = activeResult.outcome === "boss_victory" || activeResult.outcome === "pool_victory";
  const isBossVictory = activeResult.outcome === "boss_victory";
  const isPoolCleared = activeResult.outcome === "pool_victory";
  const isDefeat = activeResult.outcome === "defeat" || activeResult.outcome === "boss_defeat";

  const categoryName = formatCategoryName(activeResult.category);

  const outcomeConfig = {
    boss_victory: {
      badge: "🏆 ULTIMATE VICTORY SECURED 🏆",
      title: "VICTORY SECURED",
      desc: `Incredible! You have bypassed all defense layers and terminated the core system architect of ${categoryName}. Your legendary accomplishment is ready for the archives.`,
      badgeStyle: "bg-neonCyan/20 border-neonCyan text-neonCyan shadow-[0_0_20px_rgba(34,211,238,0.4)]",
      titleStyle: "from-neonCyan to-neonViolet text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]",
    },
    pool_victory: {
      badge: "🏆 SYSTEM OVERLOAD // CLEARED 🏆",
      title: "POOL CLEARED",
      desc: `All available query challenges in ${categoryName} have been exhausted. You successfully survived the entire simulation mainframe.`,
      badgeStyle: "bg-amber-500/15 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)]",
      titleStyle: "from-amber-400 to-neonCyan text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    },
    boss_defeat: {
      badge: "⚠️ SO CLOSE // FAIL AT ARCHITECT ⚠️",
      title: "SO CLOSE...",
      desc: `You reached the final Boss round of ${categoryName}, but the core security protocols overwhelmed your shields. Initialize a new session to claim ultimate victory!`,
      badgeStyle: "bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
      titleStyle: "from-red-500 to-textMuted text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]",
    },
    defeat: {
      badge: "🛡️ DEFEAT REGISTERED 🛡️",
      title: "SIMULATION FAILED",
      desc: `Your session was terminated. You were overcome by the high-difficulty security measures of ${categoryName}. Prepare yourself and try again.`,
      badgeStyle: "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
      titleStyle: "from-red-500 to-textMuted text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    },
  };

  const currentConfig = outcomeConfig[activeResult.outcome] || outcomeConfig.defeat;

  // Formatting utility for time
  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return "00:00";
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm < 10 ? "0" + mm : mm}:${ss < 10 ? "0" + ss : ss}`;
  };

  // Handle score submission to Supabase
  const handleScoreSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitized = sanitizeNickname(nickname);
    if (!sanitized) {
      setSubmitError("⚠️ SYSTEM ERROR: HANDLE CANNOT BE EMPTY");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .insert({
          nickname: sanitized,
          category: activeResult.category,
          score: activeResult.score,
          streak: activeResult.peakStreak,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.warn("Supabase entry error or offline warning:", error);

        const updatedResult: QuizResult = {
          ...activeResult,
          submitted: true,
          submittedId: "local_" + Math.random().toString(36).substring(2, 9),
          nickname: sanitized,
        };
        sessionStorage.setItem("impossible_quiz_result", JSON.stringify(updatedResult));
        setSessionResult(updatedResult);
        setSubmitError("Database offline. Score saved in temporary local session.");
      } else {
        const updatedResult: QuizResult = {
          ...activeResult,
          submitted: true,
          submittedId: data?.id || "submitted_" + Math.random().toString(36).substring(2, 9),
          nickname: sanitized,
        };
        sessionStorage.setItem("impossible_quiz_result", JSON.stringify(updatedResult));
        setSessionResult(updatedResult);
      }
    } catch (err) {
      console.error("Failed to submit score:", err);
      setSubmitError("Failed to establish mainframe upload. Cached locally.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy share text to clipboard
  const copyShareText = () => {
    const outcomeStr =
      activeResult.outcome === "boss_victory"
        ? "🏆 VICTORY SECURED (Boss Defeated)"
        : activeResult.outcome === "pool_victory"
        ? "🏆 POOL CLEARED"
        : activeResult.outcome === "boss_defeat"
        ? "⚠️ SO CLOSE (Terminated at Boss)"
        : "🛡️ SIMULATION FAILED";

    let shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/results?score=${activeResult.score}&streak=${activeResult.peakStreak}&category=${activeResult.category}&outcome=${activeResult.outcome}&time=${activeResult.timeTaken || 0}`
      : "";

    let twinDetailText = "";
    if (activeResult.aiTwinEnabled) {
      shareUrl += `&aiTwin=true&aiScore=${activeResult.aiScore}&aiStreak=${activeResult.aiStreak}`;

      const twinOutcome = activeResult.score > (activeResult.aiScore || 0)
        ? "🏆 DEFEATED THE AI TWIN"
        : activeResult.score < (activeResult.aiScore || 0)
        ? "⚠️ LOST TO THE AI TWIN"
        : "⚖️ TIED WITH THE AI TWIN";

      twinDetailText = `AI Twin Mode: Active
AI Outcome: ${twinOutcome}
AI Score: ${(activeResult.aiScore || 0).toLocaleString()}
AI Peak Streak: ${activeResult.aiStreak || 0}
---------------------------------
`;
    }

    const text = `🏆 THE IMPOSSIBLE QUIZ GENERATOR 🏆
---------------------------------
Category: ${categoryName}
Outcome: ${outcomeStr}
Final Score: ${activeResult.score.toLocaleString()}
Peak Streak: ${activeResult.peakStreak}
Accuracy: ${activeResult.accuracy}%
Time Taken: ${formatTime(activeResult.timeTaken)}
Questions: ${activeResult.correct}/${activeResult.total}
---------------------------------
${twinDetailText}Can you survive the AI mainframe? Try now!
Link: ${shareUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download share card using html2canvas
  const downloadShareCard = async () => {
    const element = document.getElementById("share-card");
    if (!element) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#0a0b10",
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `impossible_quiz_clearance_${activeResult.score}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating share card:", error);
    } finally {
      setDownloading(false);
    }
  };

  // Extract category and difficulty details for immediate replay navigation
  const replayPath = useMemo(() => {
    const isAiTwin = activeResult.aiTwinEnabled ? "true" : "false";
    const categoryId = activeResult.category;

    if (categoryId.startsWith("programming_")) {
      return `/quiz?category=${categoryId}&aiTwin=${isAiTwin}`;
    }
    if (categoryId.startsWith("business_")) {
      return `/quiz?category=${categoryId}&aiTwin=${isAiTwin}`;
    }
    if (categoryId.startsWith("english_")) {
      return `/quiz?category=${categoryId}&aiTwin=${isAiTwin}`;
    }
    if (
      categoryId.startsWith("logic-algorithms_") ||
      categoryId.startsWith("data-analytics_") ||
      categoryId.startsWith("computer-science-fundamentals_")
    ) {
      return `/quiz?category=${categoryId}&aiTwin=${isAiTwin}`;
    }
    return `/quiz?category=${categoryId}&aiTwin=${isAiTwin}`;
  }, [activeResult]);

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full select-none relative transition-all duration-300 ${
      isBossVictory ? "animate-victory-scale-in" : isPoolCleared ? "animate-pool-scale-in" : "animate-defeat-glitch-in"
    }`}>
      {/* Dynamic Celebratory / Glitch Background styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes victory-scale-in {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          70% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pool-scale-in {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes defeat-glitch-in {
          0% { opacity: 0; transform: scale(1.05); filter: hue-rotate(45deg); }
          10% { opacity: 0.8; filter: grayscale(0.5); }
          20% { opacity: 0.3; transform: scale(0.98); }
          30% { opacity: 1; transform: scale(1); filter: none; }
          100% { opacity: 1; }
        }
        @keyframes scanline-anim {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes noise-flicker {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }
        @keyframes achievement-unlock {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes badge-spin {
          0% { transform: rotate(-45deg) scale(0.6); }
          100% { transform: rotate(0) scale(1); }
        }
        .animate-achievement-unlock {
          animation: achievement-unlock 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-badge-spin {
          animation: badge-spin 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .victory-glow-wash {
          background: radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(168,85,247,0.08) 50%, rgba(10,11,16,0) 100%);
        }
        .pool-amber-wash {
          background: radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(34,211,238,0.05) 60%, rgba(10,11,16,0) 100%);
        }
        .defeat-red-wash {
          background: radial-gradient(circle, rgba(239,68,68,0.12) 0%, rgba(10,11,16,0) 100%);
        }
      `}} />

      {/* Background Visual Enhancements */}
      {isBossVictory && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
          <div className="absolute inset-0 victory-glow-wash opacity-80 animate-pulse"></div>
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-neonViolet/15 to-neonCyan/15 blur-3xl animate-[pulse-glow_4s_infinite_alternate]"></div>
          <div className="absolute w-[300px] h-[300px] rounded-full border border-neonViolet/25 animate-[spin-slow_25s_linear_infinite]"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-neonCyan/20 animate-[spin-slow_35s_linear_infinite_reverse]"></div>
        </div>
      )}

      {isPoolCleared && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
          <div className="absolute inset-0 pool-amber-wash opacity-60"></div>
          <div className="w-[450px] h-[450px] rounded-full bg-gradient-to-r from-amber-500/10 to-neonCyan/10 blur-3xl"></div>
          {/* Calm scanning line simulation */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-amber-500/30 animate-[scanline-anim_8s_linear_infinite]"></div>
        </div>
      )}

      {isDefeat && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
          <div className="absolute inset-0 defeat-red-wash opacity-90"></div>
          <div className="w-[500px] h-[500px] rounded-full bg-red-600/5 blur-3xl"></div>
          {/* Glitch noise and scanline overlays */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(transparent_50%,rgba(0,0,0,0.8))]"></div>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/30 animate-[scanline-anim_4s_linear_infinite]"></div>
          <div className="absolute inset-0 bg-red-500/[0.02] mix-blend-overlay animate-[noise-flicker_0.15s_infinite]"></div>
        </div>
      )}

      {/* Newly Unlocked Achievement Notification (Non-blocking sequential toast) */}
      {currentToast && (
        <div className="fixed bottom-6 right-6 z-50 border-2 border-neonCyan bg-bgDark shadow-[0_0_20px_rgba(34,211,238,0.4)] px-6 py-4 rounded-lg flex items-center gap-4 animate-achievement-unlock font-display overflow-hidden min-w-[280px]">
          {/* Neon Glow Sweep line */}
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-neonCyan to-neonViolet"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neonCyan/5 to-transparent pointer-events-none"></div>

          {/* Badge Icon Animating in with spin & glow */}
          <div className="text-3xl shrink-0 animate-badge-spin filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
            {currentToast.icon}
          </div>

          <div className="flex-1">
            <div className="text-[9px] font-black text-neonCyan uppercase tracking-[0.2em] animate-pulse">
              🏆 ACHIEVEMENT UNLOCKED!
            </div>
            <div className="text-xs text-textPrimary font-bold mt-0.5 uppercase tracking-wide">
              {currentToast.title}
            </div>
            <div className="text-[9px] text-textMuted mt-0.5 leading-normal">
              {currentToast.description}
            </div>
          </div>

          <button
            onClick={() => setCurrentToast(null)}
            className="text-[10px] text-textMuted hover:text-neonCyan ml-2 focus:outline-none cursor-pointer transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Outcome Badge */}
      <div className={`mb-6 inline-flex items-center gap-2 border px-6 py-2.5 rounded-full text-xs md:text-sm font-black font-display tracking-widest uppercase transition-all duration-300 ${
        isVictory ? "animate-bounce" : ""
      } ${currentConfig.badgeStyle}`}>
        {currentConfig.badge}
      </div>

      <h1 className={`text-4xl md:text-6xl font-black font-display tracking-tight mb-2 text-center bg-gradient-to-r text-transparent bg-clip-text ${currentConfig.titleStyle}`}>
        {currentConfig.title}
      </h1>

      <p className="text-textMuted max-w-lg text-center text-sm md:text-base mb-6 leading-relaxed">
        {currentConfig.desc}
      </p>

      {/* Interactive XP feedback indicator */}
      {xpGained > 0 && (
        <div className="mb-6 flex items-center gap-2 text-xs font-bold font-display tracking-widest text-neonCyan animate-pulse">
          ⚡ INTRUSION TELEMETRY COMMITTED // <span className="text-neonViolet font-black">+{xpGained} XP GAINED</span> ⚡
        </div>
      )}

      {/* AI Twin Side-by-Side Head-to-Head panel (Visible during gameplay results view) */}
      {activeResult.aiTwinEnabled && (
        <div className="w-full p-6 rounded-lg bg-bgDark/80 border-2 border-neonCyan/30 mb-8 font-display text-center relative overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <div className="absolute top-0 right-0 w-3 h-3 bg-neonCyan"></div>

          <h2 className="text-[10px] tracking-widest text-neonCyan font-black uppercase mb-4">
            🤖 AI TWIN SECTOR // HEAD-TO-HEAD COMPARISON
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-4">
            {/* Player Stats */}
            <div className="flex flex-col gap-2 p-3 rounded bg-bgDark border border-neonCyan/20 text-left">
              <span className="text-[10px] text-textMuted uppercase tracking-widest">YOU (PLAYER)</span>
              <span className="text-2xl font-black text-neonCyan drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
                {activeResult.score.toLocaleString()}
              </span>
              <span className="text-[9px] text-textMuted uppercase tracking-wider">Peak Streak: {activeResult.peakStreak}</span>

              {/* Score Race Bar - Player */}
              <div className="w-full h-2 bg-black/50 border border-neonCyan/20 rounded-full mt-2 overflow-hidden">
                <div
                  style={{
                    width: `${raceProgress * 100}%`,
                    transition: "width 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)"
                  }}
                  className="h-full bg-gradient-to-r from-neonCyan to-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                ></div>
              </div>
            </div>

            {/* AI Twin Stats */}
            <div className="flex flex-col gap-2 p-3 rounded bg-bgDark border border-neonViolet/30 text-left">
              <span className="text-[10px] text-textMuted uppercase tracking-widest">AI TWIN</span>
              <span className="text-2xl font-black text-neonViolet drop-shadow-[0_0_5px_rgba(168,85,247,0.3)]">
                {(activeResult.aiScore || 0).toLocaleString()}
              </span>
              <span className="text-[9px] text-textMuted uppercase tracking-wider">Peak Streak: {activeResult.aiStreak || 0}</span>

              {/* Score Race Bar - AI */}
              <div className="w-full h-2 bg-black/50 border border-neonViolet/20 rounded-full mt-2 overflow-hidden">
                <div
                  style={{
                    width: `${raceProgress * (activeResult.score > 0 ? Math.min(((activeResult.aiScore || 0) / activeResult.score) * 100, 100) : 100)}%`,
                    transition: "width 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)"
                  }}
                  className="h-full bg-gradient-to-r from-neonViolet to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                ></div>
              </div>
            </div>
          </div>

          <div className={`py-3 px-4 rounded border font-black text-xs tracking-wider uppercase ${
            activeResult.score > (activeResult.aiScore || 0)
              ? "bg-neonCyan/10 border-neonCyan text-neonCyan shadow-[0_0_12px_rgba(34,211,238,0.2)]"
              : activeResult.score < (activeResult.aiScore || 0)
              ? "bg-neonViolet/10 border-neonViolet text-neonViolet shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              : "bg-textMuted/10 border-textMuted text-textPrimary"
          }`}>
            {activeResult.score > (activeResult.aiScore || 0) ? (
              <span>🏆 SYSTEM OVERLOAD // YOU DEFEATED THE AI TWIN! 🏆</span>
            ) : activeResult.score < (activeResult.aiScore || 0) ? (
              <span>⚠️ CORE FAILURE // THE AI TWIN OUT-INFILTRATED YOU! ⚠️</span>
            ) : (
              <span>⚖️ QUANTUM ENTANGLEMENT // MATCH WAS A TIE! ⚖️</span>
            )}
          </div>
        </div>
      )}

      {/* Share Card & Score Dashboard Container */}
      <div
        id="share-card"
        className={`w-full p-8 rounded-lg bg-bgDark border-2 relative overflow-hidden mb-8 ${
          isBossVictory
            ? "border-neonCyan shadow-[0_0_30px_rgba(34,211,238,0.25)] animate-card-glow"
            : isPoolCleared
            ? "border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.15)]"
            : "border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.15)] animate-pulse"
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-neonViolet/5 transform rotate-45 translate-x-12 -translate-y-12 border-b border-l border-neonViolet/10"></div>
        <div className="absolute bottom-2 right-4 text-[10px] font-mono text-neonViolet/25 tracking-widest uppercase font-display">
          SECURE TERMINAL // CLEARANCE REPORT
        </div>

        {/* Share Card Header */}
        <div className="border-b border-neonViolet/15 pb-4 mb-6 flex justify-between items-center select-none">
          <div className="flex flex-col">
            <span className="text-[10px] font-display tracking-widest text-textMuted uppercase">SYSTEM MODULE</span>
            <span className="text-xs md:text-sm font-bold text-neonCyan font-display uppercase tracking-wider">{categoryName}</span>
          </div>
          <div className="text-right flex flex-col font-display">
            <span className="text-[10px] tracking-widest text-textMuted uppercase">OUTCOME</span>
            <span className={`text-xs md:text-sm font-black uppercase ${isVictory ? "text-neonCyan" : "text-neonViolet"}`}>
              {activeResult.outcome.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Optional AI Twin Stamp directly embedded inside the share card image */}
        {activeResult.aiTwinEnabled && (
          <div className="mb-6 flex justify-center">
            <div className={`px-4 py-1.5 rounded border-2 text-[10px] font-display font-black uppercase tracking-widest ${
              activeResult.score > (activeResult.aiScore || 0)
                ? "bg-neonCyan/10 border-neonCyan text-neonCyan shadow-[0_0_8px_rgba(34,211,238,0.2)] animate-pulse"
                : activeResult.score < (activeResult.aiScore || 0)
                ? "bg-neonViolet/10 border-neonViolet text-neonViolet shadow-[0_0_8px_rgba(168,85,247,0.2)]"
                : "bg-textMuted/10 border-textMuted text-textPrimary"
            }`}>
              {activeResult.score > (activeResult.aiScore || 0)
                ? "🏆 DEFEATED THE AI TWIN"
                : activeResult.score < (activeResult.aiScore || 0)
                ? "⚠️ LOST TO THE AI TWIN"
                : "⚖️ TIED WITH THE AI TWIN"}
            </div>
          </div>
        )}

        {/* Primary Stats Panel (Score & Streak) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 font-display text-center select-none">
          {/* Final Score */}
          <div className="p-5 rounded border border-neonCyan/40 bg-bgDark/60 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
            <span className="text-xs tracking-widest text-textMuted block uppercase mb-1 font-bold">FINAL SCORE</span>
            <span className="text-4xl font-black text-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              {activeResult.score.toLocaleString()}
            </span>
          </div>

          {/* Peak Streak */}
          <div className="p-5 rounded border border-neonViolet/40 bg-bgDark/60 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
            <span className="text-xs tracking-widest text-textMuted block uppercase mb-1 font-bold font-display">PEAK STREAK</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-4xl font-black text-neonViolet drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                {activeResult.peakStreak}
              </span>
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </div>

        {/* Secondary Stats Panel (Accuracy, Completed, Time Taken, Best) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center select-none font-display">
          {/* Accuracy */}
          <div className="p-3 rounded bg-bgDark/40 border border-neonViolet/10 shadow-[inset_0_0_6px_rgba(168,85,247,0.02)]">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-1">ACCURACY</span>
            <span className="text-lg font-black text-neonCyan">
              {activeResult.accuracy}%
            </span>
          </div>

          {/* Completed */}
          <div className="p-3 rounded bg-bgDark/40 border border-neonViolet/10 shadow-[inset_0_0_6px_rgba(168,85,247,0.02)]">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-1">COMPLETED</span>
            <span className="text-lg font-black text-neonViolet">
              {activeResult.correct}/{activeResult.total}
            </span>
          </div>

          {/* Time Taken */}
          <div className="p-3 rounded bg-bgDark/40 border border-neonViolet/10 shadow-[inset_0_0_6px_rgba(168,85,247,0.02)]">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-1">TIME TAKEN</span>
            <span className="text-lg font-black text-neonCyan">
              {formatTime(activeResult.timeTaken)}
            </span>
          </div>

          {/* Personal Best */}
          <div className="p-3 rounded bg-bgDark/40 border border-neonViolet/10 shadow-[inset_0_0_6px_rgba(168,85,247,0.02)] relative">
            <span className="text-[9px] tracking-widest text-textMuted block uppercase mb-1">PERSONAL BEST</span>
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg font-black text-neonViolet">
                {personalBest !== null ? personalBest.toLocaleString() : "---"}
              </span>
              {isNewBest && (
                <span className="absolute -top-2 right-2 text-[8px] font-bold text-neonCyan bg-neonCyan/10 border border-neonCyan/30 px-1 py-0.5 rounded uppercase tracking-wider animate-bounce">
                  New Best!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share / Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-4 mb-10 justify-center">
        <button
          onClick={copyShareText}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded border border-neonViolet/40 hover:border-neonViolet bg-bgDark hover:bg-neonViolet/5 text-textPrimary hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] focus:outline-none focus:ring-2 focus:ring-neonViolet"
        >
          {copied ? "📋 COPIED SECURELY!" : "🔗 COPY RESULT TEXT"}
        </button>

        <button
          onClick={downloadShareCard}
          disabled={downloading}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded border border-neonCyan/40 hover:border-neonCyan bg-bgDark hover:bg-neonCyan/5 text-neonCyan hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] focus:outline-none focus:ring-2 focus:ring-neonCyan"
        >
          {downloading ? "⚙️ GENERATING CARD..." : "🖼️ DOWNLOAD SHARE IMAGE"}
        </button>
      </div>

      {/* Nickname Submission Section */}
      <div className="w-full p-6 rounded-lg bg-bgDark border border-neonViolet/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] mb-12">
        {activeResult.submitted ? (
          <div className="text-center py-2 font-display">
            <div className="inline-flex items-center gap-2 text-neonCyan text-sm font-black uppercase">
              <span>✅ RECORD SECURED</span>
            </div>
            <p className="text-xs text-textMuted mt-1 tracking-wider">
              Handle <span className="text-neonCyan font-bold">{activeResult.nickname}</span> has been permanently logged with score <span className="text-neonCyan font-bold">{activeResult.score.toLocaleString()}</span>.
            </p>
            {submitError && (
              <p className="text-[10px] text-neonViolet mt-1 tracking-wider">{submitError}</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleScoreSubmission} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 font-display">
              <h3 className="text-sm font-black tracking-widest text-textPrimary uppercase">
                TRANSMIT SCORE TO ARCHIVES
              </h3>
              <p className="text-xs text-textMuted">
                Register your performance handle on the global hall of champions. No authentication required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                maxLength={15}
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="NICKNAME (MAX 15 CHARS)"
                disabled={isSubmitting}
                className="flex-1 bg-bgDark/80 border border-neonViolet/30 focus:border-neonCyan rounded px-4 py-3 text-sm font-display text-textPrimary placeholder:text-textMuted/40 focus:outline-none focus:ring-1 focus:ring-neonCyan transition-all uppercase"
              />
              <button
                type="submit"
                disabled={isSubmitting || !nickname.trim()}
                className="bg-neonViolet hover:bg-neonViolet/90 disabled:opacity-50 text-textPrimary text-xs font-black tracking-widest uppercase px-6 py-3 rounded border border-transparent hover:border-neonCyan shadow-[0_0_10px_rgba(168,85,247,0.3)] focus:outline-none focus:ring-2 focus:ring-neonCyan transition-all flex items-center justify-center min-w-[140px] font-display"
              >
                {isSubmitting ? "TRANSMITTING..." : "SUBMIT SCORE"}
              </button>
            </div>

            {/* Contextual EEAT Privacy Note */}
            <p className="text-[10px] font-mono text-textMuted/60 leading-normal border-t border-neonViolet/10 pt-3">
              🔒 <span className="text-neonCyan font-bold">PRIVACY NOTICE:</span> Nickname submissions are public and strictly anonymous. No emails, IP logs, tracking cookies, or personally identifiable data are harvested. For further telemetry policies, read our <Link href="/about" className="text-neonCyan underline hover:text-neonViolet transition-colors duration-200">About/Privacy disclosure</Link>.
            </p>

            {submitError && (
              <p className="text-xs text-neonViolet font-display mt-1 text-center sm:text-left">{submitError}</p>
            )}
          </form>
        )}
      </div>

      {/* Buttons Action Group (Visually Differentiated: Replay vs New Challenge) */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center font-display">
        {/* Replay Option: High emphasis neon/solid background for easy replayability */}
        <Link
          href={replayPath}
          className="w-full sm:w-auto text-center px-10 py-4 text-base font-black tracking-widest uppercase transition-all duration-300 rounded bg-neonCyan text-bgDark hover:bg-neonCyan/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] focus:outline-none focus:ring-2 focus:ring-neonCyan"
        >
          REPLAY INSTANTLY 🔄
        </Link>

        {/* New Challenge Option: Medium emphasis outline style */}
        <Link
          href="/categories"
          className="w-full sm:w-auto text-center px-10 py-4 text-base font-bold tracking-widest uppercase transition-all duration-300 rounded border-2 border-neonViolet text-textPrimary hover:bg-neonViolet/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] focus:outline-none focus:ring-2 focus:ring-neonViolet"
        >
          NEW CHALLENGE
        </Link>

        {/* View Leaderboard */}
        <Link
          href="/leaderboard"
          className="w-full sm:w-auto text-center px-10 py-4 text-base font-medium tracking-widest uppercase transition-all duration-300 rounded border border-textMuted/40 hover:border-textMuted bg-bgDark hover:bg-textMuted/5 text-textMuted hover:text-textPrimary"
        >
          VIEW LEADERBOARD
        </Link>
      </div>

      {/* Home retreat option */}
      <Link
        href="/"
        className="mt-12 text-xs font-display tracking-widest text-textMuted hover:text-neonCyan transition-colors duration-300 ease-in-out uppercase border-b border-textMuted/20 hover:border-neonCyan/50 pb-0.5 focus:outline-none focus:ring-1 focus:ring-neonCyan"
      >
        ← ESCAPE TO HEADQUARTERS (HOME)
      </Link>
    </div>
  );
}

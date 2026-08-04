export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji representing the achievement
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_victory",
    title: "First Victory",
    description: "Successfully complete a quiz in any category or difficulty.",
    icon: "🏆",
  },
  {
    id: "boss_slayer",
    title: "Boss Slayer",
    description: "Defeat the core security system in a Boss Round.",
    icon: "💀",
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Achieve 100% accuracy in a quiz.",
    icon: "🎯",
  },
  {
    id: "streak_master",
    title: "Streak Master",
    description: "Build an active answer streak of 10 or more.",
    icon: "🔥",
  },
  {
    id: "escape_artist",
    title: "Escape Artist",
    description: "Successfully complete the standalone Code Escape Room.",
    icon: "🔒",
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Play 3 or more distinct programming languages.",
    icon: "🗣️",
  },
  {
    id: "twin_beater",
    title: "Twin Beater",
    description: "Beat the simulated parallel AI Twin in a direct head-to-head matchup.",
    icon: "🤖",
  },
  {
    id: "academic_infiltrator",
    title: "Academic Infiltrator",
    description: "Acquire a cumulative total of 500 or more XP.",
    icon: "🧠",
  },
  {
    id: "impossible_survivor",
    title: "Impossible Survivor",
    description: "Successfully complete a quiz on 'Impossible' difficulty.",
    icon: "☣️",
  },
];

// Local storage key for achievements
export const ACHIEVEMENTS_STORAGE_KEY = "impossible_quiz_unlocked_achievements";
// Local storage key for XP
export const XP_STORAGE_KEY = "impossible_quiz_cumulative_xp";
// Local storage key for polyglot languages tracking
export const POLYGLOT_LANGUAGES_KEY = "impossible_quiz_played_languages";

export interface EvaluationInput {
  score: number;
  peakStreak: number;
  category: string;
  outcome: "boss_victory" | "pool_victory" | "defeat" | "boss_defeat";
  accuracy: number;
  correct: number;
  total: number;
  aiTwinEnabled?: boolean;
  aiScore?: number;
  aiStreak?: number;
}

/**
 * Calculates XP earned for a quiz attempt.
 */
export function calculateQuizXP(input: EvaluationInput): number {
  let baseXP = 10; // default for easy
  const catParts = input.category.split("_");
  const difficulty = catParts[2] || (input.category.includes("_") ? catParts[1] : "easy");

  if (difficulty === "medium") baseXP = 20;
  else if (difficulty === "hard") baseXP = 35;
  else if (difficulty === "impossible") baseXP = 60;

  // Streak bonus: 2 XP per peak streak item
  const streakBonus = input.peakStreak * 2;

  // Accuracy bonus: up to 15 XP scaled by accuracy
  const accuracyBonus = Math.round((input.accuracy / 100) * 15);

  return baseXP + streakBonus + accuracyBonus;
}

/**
 * Gets cumulative XP from localStorage.
 */
export function getCumulativeXP(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(XP_STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (e) {
    console.error("Failed to read cumulative XP:", e);
    return 0;
  }
}

/**
 * Adds XP to cumulative XP and returns the new total.
 */
export function addXP(amount: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const current = getCumulativeXP();
    const next = current + amount;
    localStorage.setItem(XP_STORAGE_KEY, next.toString());
    // Dispatch custom event to trigger reactive UI updates
    window.dispatchEvent(new Event("xp-updated"));
    return next;
  } catch (e) {
    console.error("Failed to add XP:", e);
    return 0;
  }
}

/**
 * Gets array of unlocked achievement IDs.
 */
export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to read unlocked achievements:", e);
    return [];
  }
}

/**
 * Saves a new unlocked achievement to local storage.
 * Returns true if the achievement was newly unlocked.
 */
export function unlockAchievement(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const unlocked = getUnlockedAchievements();
    if (unlocked.includes(id)) return false;

    const next = [...unlocked, id];
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("achievement-unlocked", { detail: id }));
    return true;
  } catch (e) {
    console.error("Failed to unlock achievement:", e);
    return false;
  }
}

/**
 * Evaluates achievements based on quiz results.
 * Returns an array of achievements that were newly unlocked during this evaluation.
 */
export function evaluateQuizAchievements(input: EvaluationInput, currentXP: number): Achievement[] {
  if (typeof window === "undefined") return [];

  const newlyUnlocked: Achievement[] = [];
  const isVictory = input.outcome === "boss_victory" || input.outcome === "pool_victory";

  // 1. First Victory
  if (isVictory) {
    if (unlockAchievement("first_victory")) {
      const match = ACHIEVEMENTS.find((a) => a.id === "first_victory");
      if (match) newlyUnlocked.push(match);
    }
  }

  // 2. Boss Slayer
  if (input.outcome === "boss_victory") {
    if (unlockAchievement("boss_slayer")) {
      const match = ACHIEVEMENTS.find((a) => a.id === "boss_slayer");
      if (match) newlyUnlocked.push(match);
    }
  }

  // 3. Perfectionist
  if (isVictory && input.accuracy === 100 && input.total >= 5) {
    if (unlockAchievement("perfectionist")) {
      const match = ACHIEVEMENTS.find((a) => a.id === "perfectionist");
      if (match) newlyUnlocked.push(match);
    }
  }

  // 4. Streak Master
  if (input.peakStreak >= 10) {
    if (unlockAchievement("streak_master")) {
      const match = ACHIEVEMENTS.find((a) => a.id === "streak_master");
      if (match) newlyUnlocked.push(match);
    }
  }

  // 5. Polyglot: Play 3+ distinct programming languages
  if (input.category.startsWith("programming_")) {
    try {
      const lang = input.category.split("_")[1];
      if (lang) {
        const playedStr = localStorage.getItem(POLYGLOT_LANGUAGES_KEY);
        const played: string[] = playedStr ? JSON.parse(playedStr) : [];
        if (!played.includes(lang)) {
          const nextPlayed = [...played, lang];
          localStorage.setItem(POLYGLOT_LANGUAGES_KEY, JSON.stringify(nextPlayed));
          if (nextPlayed.length >= 3) {
            if (unlockAchievement("polyglot")) {
              const match = ACHIEVEMENTS.find((a) => a.id === "polyglot");
              if (match) newlyUnlocked.push(match);
            }
          }
        }
      }
    } catch (e) {
      console.error("Polyglot check failed:", e);
    }
  }

  // 6. Twin Beater
  if (input.aiTwinEnabled && isVictory) {
    const playerWin = input.score > (input.aiScore || 0);
    if (playerWin) {
      if (unlockAchievement("twin_beater")) {
        const match = ACHIEVEMENTS.find((a) => a.id === "twin_beater");
        if (match) newlyUnlocked.push(match);
      }
    }
  }

  // 7. Academic Infiltrator: XP >= 500
  if (currentXP >= 500) {
    if (unlockAchievement("academic_infiltrator")) {
      const match = ACHIEVEMENTS.find((a) => a.id === "academic_infiltrator");
      if (match) newlyUnlocked.push(match);
    }
  }

  // 8. Impossible Survivor
  const isImpossible = input.category.includes("_impossible") || input.category.endsWith("_impossible");
  if (isImpossible && isVictory) {
    if (unlockAchievement("impossible_survivor")) {
      const match = ACHIEVEMENTS.find((a) => a.id === "impossible_survivor");
      if (match) newlyUnlocked.push(match);
    }
  }

  return newlyUnlocked;
}

import { NextResponse } from "next/server";
import { staticQuestions } from "../../../lib/questions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface GeminiQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: string;
  category: string;
}

const formatSubcategoryName = (id: string): string => {
  if (id === "business-strategy") return "Business Strategy";
  if (id === "synonyms-antonyms") return "Synonyms & Antonyms";
  if (id === "idioms-phrases") return "Idioms & Phrases";
  if (id === "reading-comprehension") return "Reading Comprehension";
  if (id === "sentence-correction") return "Sentence Correction";
  return id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

function createNoCacheResponse(data: any) {
  const response = NextResponse.json(data);
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

function getFallbackQuestion(
  category: string,
  difficulty: string,
  alreadyAskedIds: string[],
  alreadyAskedTexts: string[],
  isBossRound?: boolean
) {
  let targetCategory = category;
  let targetDifficulty = difficulty;

  // If compound category like programming_rust_impossible or programming_rust_medium
  if (category.startsWith("programming_") || category.startsWith("business_") || category.startsWith("english_")) {
    const parts = category.split("_");
    const prefix = parts[0];
    if (parts.length >= 3) {
      targetCategory = `${prefix}_${parts[1]}`;
      targetDifficulty = parts[2];
    } else if (parts.length === 2) {
      targetCategory = `${prefix}_${parts[1]}`;
    }
  }

  const getSector = (cat: string): string => {
    if (cat.startsWith("programming")) return "programming";
    if (cat.startsWith("business")) return "business";
    if (cat.startsWith("english")) return "english";
    return "";
  };
  const targetSector = getSector(targetCategory);
  const matchSector = (cat: string): boolean => {
    if (!targetSector) return false;
    if (targetSector === "programming") {
      return cat.startsWith("programming");
    }
    return cat.startsWith(targetSector + "_");
  };

  // Level 1: Exact subcategory and exact difficulty (not asked)
  let candidates = staticQuestions.filter((q) => {
    const matchCategory = q.category === targetCategory;
    const matchBoss = isBossRound ? q.isBossRound : true;
    const matchDiff = isBossRound ? true : q.difficulty === targetDifficulty;
    const notAskedId = !alreadyAskedIds.includes(q.id);
    const notAskedText = !alreadyAskedTexts.includes(q.questionText);
    return matchCategory && matchBoss && matchDiff && notAskedId && notAskedText;
  });

  // Level 2: Exact subcategory, any difficulty (not asked)
  if (candidates.length === 0) {
    candidates = staticQuestions.filter((q) => {
      const matchCategory = q.category === targetCategory;
      const notAskedId = !alreadyAskedIds.includes(q.id);
      const notAskedText = !alreadyAskedTexts.includes(q.questionText);
      return matchCategory && notAskedId && notAskedText;
    });
  }

  // Level 3: Same sector/prefix, any difficulty (not asked)
  if (candidates.length === 0) {
    candidates = staticQuestions.filter((q) => {
      const notAskedId = !alreadyAskedIds.includes(q.id);
      const notAskedText = !alreadyAskedTexts.includes(q.questionText);
      return matchSector(q.category) && notAskedId && notAskedText;
    });
  }

  // Level 4: Entire bank, any difficulty (not asked)
  if (candidates.length === 0) {
    candidates = staticQuestions.filter((q) => {
      const notAskedId = !alreadyAskedIds.includes(q.id);
      const notAskedText = !alreadyAskedTexts.includes(q.questionText);
      return notAskedId && notAskedText;
    });
  }

  // Level 5: Relaxed (allow repeats)
  if (candidates.length === 0) {
    // Relaxed Level 1: Exact category and exact difficulty
    candidates = staticQuestions.filter((q) => {
      const matchCategory = q.category === targetCategory;
      const matchBoss = isBossRound ? q.isBossRound : true;
      const matchDiff = isBossRound ? true : q.difficulty === targetDifficulty;
      return matchCategory && matchBoss && matchDiff;
    });
  }

  if (candidates.length === 0) {
    // Relaxed Level 2: Exact category, any difficulty
    candidates = staticQuestions.filter((q) => q.category === targetCategory);
  }

  if (candidates.length === 0) {
    // Relaxed Level 3: Same sector/prefix, any difficulty
    candidates = staticQuestions.filter((q) => matchSector(q.category));
  }

  if (candidates.length === 0) {
    // Relaxed Level 4: Entire bank, any difficulty
    candidates = staticQuestions;
  }

  const randIdx = Math.floor(Math.random() * candidates.length);
  return candidates[randIdx];
}

function isValidQuestion(json: unknown): json is GeminiQuestion {
  if (!json || typeof json !== "object") return false;
  const q = json as Record<string, unknown>;
  if (typeof q.question !== "string" || q.question.trim().length === 0) return false;
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  if (q.options.some((opt: unknown) => typeof opt !== "string" || opt.trim().length === 0)) return false;
  if (typeof q.correctAnswerIndex !== "number" || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) return false;
  return true;
}

async function callGemini(
  category: string,
  difficulty: string,
  alreadyAskedTexts: string[],
  isBossRound: boolean,
  language?: string,
  subcategory?: string,
  categoryType?: "programming" | "business" | "english"
): Promise<unknown | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined in environment variables.");
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  let prompt = "";
  if (categoryType === "programming" && language) {
    const capitalizedLang = language.charAt(0).toUpperCase() + language.slice(1);
    if (difficulty === "impossible") {
      prompt = `Generate ONE extremely complex, deep, and mind-bending multiple-choice quiz question focusing on advanced ${capitalizedLang} mechanics (e.g. compiler internal optimizations, low-level memory layout, esoteric specifications, or highly subtle language features/behaviors). The question must be genuinely "Impossible" and require elite expertise to answer correctly. Ensure the question is specific to ${capitalizedLang}.`;
    } else {
      prompt = `Generate ONE multiple-choice quiz question focusing on the ${capitalizedLang} programming language at '${difficulty}' difficulty. Ensure the concepts tested are highly relevant to ${capitalizedLang}.`;
    }
  } else if (categoryType === "business" && subcategory) {
    const capitalizedSub = formatSubcategoryName(subcategory);
    if (difficulty === "impossible") {
      prompt = `Generate ONE extremely complex, deep, and master-level multiple-choice quiz question focusing on advanced ${capitalizedSub} concepts, professional case studies, obscure economic or management theories, or highly subtle strategic or regulatory behaviors in Business. The question must be genuinely "Impossible" and require elite business expertise to answer correctly. Ensure the question is specific to ${capitalizedSub}.`;
    } else {
      prompt = `Generate ONE multiple-choice quiz question focusing on the business topic '${capitalizedSub}' at '${difficulty}' difficulty. Ensure the concepts tested are highly relevant to ${capitalizedSub}.`;
    }
  } else if (categoryType === "english" && subcategory) {
    const capitalizedSub = formatSubcategoryName(subcategory);
    if (difficulty === "impossible") {
      prompt = `Generate ONE extremely complex, advanced, and challenging multiple-choice quiz question focusing on advanced ${capitalizedSub} concepts (e.g. obscure linguistic rules, complex syntax constructions, rare idiomatic usage, or highly subtle reading comprehension and grammatical edge cases). The question must be genuinely "Impossible" and require elite linguistic and English expertise to answer correctly. Ensure the question is specific to ${capitalizedSub}.`;
    } else {
      prompt = `Generate ONE multiple-choice quiz question focusing on the English topic '${capitalizedSub}' at '${difficulty}' difficulty. Ensure the concepts tested are highly relevant to ${capitalizedSub}.`;
    }
  } else {
    prompt = `Generate ONE multiple-choice quiz question for the category '${category}' at '${difficulty}' difficulty.`;
  }

  if (isBossRound) {
    const subLabel = subcategory ? formatSubcategoryName(subcategory) : (language ? language : category);
    prompt = `Generate ONE extremely challenging, advanced, multi-part, or complex Boss Round multiple-choice quiz question for the category '${subLabel}' (difficulty is hard). This is the final Boss Round, so the question must require deep analytical reasoning or deep domain-specific knowledge.`;
  }

  prompt += ` Ensure the question has 4 plausible options, and only one correct option.`;

  if (alreadyAskedTexts && alreadyAskedTexts.length > 0) {
    prompt += ` CRITICAL REQUIREMENT: You MUST NOT generate any of the following already-asked question texts under any circumstances: ${JSON.stringify(alreadyAskedTexts)}.`;
  }

  prompt += ` Return your response in strict JSON format.`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING", description: "The quiz question text." },
          options: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Exactly 4 options.",
          },
          correctAnswerIndex: {
            type: "INTEGER",
            description: "The 0-based index of the correct answer (0, 1, 2, or 3).",
          },
          difficulty: { type: "STRING", description: "Must be 'easy', 'medium', 'hard', or 'impossible'." },
          category: { type: "STRING", description: "The category identifier." },
        },
        required: ["question", "options", "correctAnswerIndex", "difficulty", "category"],
      },
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Gemini API returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return null;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchAndValidate(
  category: string,
  difficulty: string,
  alreadyAskedTexts: string[],
  isBossRound: boolean,
  language?: string,
  subcategory?: string,
  categoryType?: "programming" | "business" | "english"
): Promise<GeminiQuestion | null> {
  // Try 1
  let result = await callGemini(category, difficulty, alreadyAskedTexts, isBossRound, language, subcategory, categoryType);
  if (result && isValidQuestion(result)) {
    return result;
  }
  // Try 2 (Retry once)
  result = await callGemini(category, difficulty, alreadyAskedTexts, isBossRound, language, subcategory, categoryType);
  if (result && isValidQuestion(result)) {
    return result;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      category = "programming",
      difficulty = "easy",
      alreadyAskedTexts = [],
      alreadyAskedIds = [],
      isBossRound = false,
    } = body;

    // Parse language/subcategory and starting difficulty
    let targetCategory = category;
    let targetDifficulty = difficulty;
    let language = "";
    let subcategory = "";
    let categoryType: "programming" | "business" | "english" | undefined = undefined;

    if (category.startsWith("programming_")) {
      categoryType = "programming";
      const parts = category.split("_");
      if (parts.length >= 3) {
        language = parts[1];
        targetDifficulty = parts[2];
        targetCategory = `programming_${language}`;
      } else if (parts.length === 2) {
        language = parts[1];
        targetCategory = `programming_${language}`;
      }
    } else if (category.startsWith("business_")) {
      categoryType = "business";
      const parts = category.split("_");
      if (parts.length >= 3) {
        subcategory = parts[1];
        targetDifficulty = parts[2];
        targetCategory = `business_${subcategory}`;
      } else if (parts.length === 2) {
        subcategory = parts[1];
        targetCategory = `business_${subcategory}`;
      }
    } else if (category.startsWith("english_")) {
      categoryType = "english";
      const parts = category.split("_");
      if (parts.length >= 3) {
        subcategory = parts[1];
        targetDifficulty = parts[2];
        targetCategory = `english_${subcategory}`;
      } else if (parts.length === 2) {
        subcategory = parts[1];
        targetCategory = `english_${subcategory}`;
      }
    }

    // Fetch from Gemini and Validate
    const geminiResult = await fetchAndValidate(
      targetCategory,
      targetDifficulty,
      alreadyAskedTexts,
      isBossRound,
      language,
      subcategory,
      categoryType
    );

    if (geminiResult) {
      // Map Gemini fields to expected Question shape
      const responseQuestion = {
        id: "ai_" + Math.random().toString(36).substring(2, 11),
        category: category, // Keep the full original category so frontend knows what session it belongs to!
        difficulty: targetDifficulty as "easy" | "medium" | "hard" | "impossible",
        questionText: geminiResult.question,
        options: geminiResult.options,
        correctAnswerIndex: geminiResult.correctAnswerIndex,
        isBossRound: isBossRound || false,
      };

      return createNoCacheResponse({
        question: responseQuestion,
        source: "gemini",
      });
    } else {
      // Fallback seamlessly to Static Question
      if (process.env.NODE_ENV === "development") {
        if (!process.env.GEMINI_API_KEY) {
          console.warn("⚠️ GEMINI_API_KEY not set — using static fallback questions");
        } else {
          console.warn("⚠️ Gemini API failed or timed out — using static fallback questions");
        }
      }

      const fallbackQuestion = getFallbackQuestion(
        category,
        targetDifficulty,
        alreadyAskedIds,
        alreadyAskedTexts,
        isBossRound
      );

      const responseQuestion = {
        id: fallbackQuestion.id,
        category: category, // Keep matching category ID
        difficulty: targetDifficulty as "easy" | "medium" | "hard" | "impossible",
        questionText: fallbackQuestion.questionText,
        options: fallbackQuestion.options,
        correctAnswerIndex: fallbackQuestion.correctAnswerIndex,
        isBossRound: fallbackQuestion.isBossRound || false,
      };

      return createNoCacheResponse({
        question: responseQuestion,
        source: "static_fallback",
      });
    }
  } catch (error) {
    console.error("Error in generate-question route:", error);
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Error in generate-question route — using static fallback questions");
    }
    // Ultimate fallback if JSON parse fails or other unexpected error
    const fallbackQuestion = getFallbackQuestion("programming", "easy", [], [], false);
    return createNoCacheResponse({
      question: fallbackQuestion,
      source: "error_fallback",
    });
  }
}

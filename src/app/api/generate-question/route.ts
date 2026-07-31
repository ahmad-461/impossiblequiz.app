import { NextResponse } from "next/server";
import { staticQuestions } from "../../../lib/questions";

interface GeminiQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: string;
  category: string;
}

function getFallbackQuestion(
  category: string,
  difficulty: string,
  alreadyAskedIds: string[],
  alreadyAskedTexts: string[],
  isBossRound?: boolean
) {
  // If isBossRound is requested, try to find a boss round question first
  let candidates = staticQuestions.filter((q) => {
    const matchCategory = q.category === category;
    const matchBoss = isBossRound ? q.isBossRound : true;
    const matchDiff = isBossRound ? true : q.difficulty === difficulty;
    const notAskedId = !alreadyAskedIds.includes(q.id);
    const notAskedText = !alreadyAskedTexts.includes(q.questionText);
    return matchCategory && matchBoss && matchDiff && notAskedId && notAskedText;
  });

  if (candidates.length === 0) {
    // Relax already-asked text/id filters
    candidates = staticQuestions.filter((q) => {
      const matchCategory = q.category === category;
      const matchBoss = isBossRound ? q.isBossRound : true;
      const matchDiff = isBossRound ? true : q.difficulty === difficulty;
      return matchCategory && matchBoss && matchDiff;
    });
  }

  if (candidates.length === 0) {
    // Relax difficulty / boss round completely
    candidates = staticQuestions.filter((q) => q.category === category);
  }

  if (candidates.length === 0) {
    // Absolute fallback
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
  isBossRound: boolean
): Promise<unknown | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined in environment variables.");
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  let prompt = `Generate ONE multiple-choice quiz question for the category '${category}' at '${difficulty}' difficulty.`;
  if (isBossRound) {
    prompt = `Generate ONE extremely challenging, advanced, multi-part, or complex Boss Round multiple-choice quiz question for the category '${category}' (difficulty is hard). This is the final Boss Round, so the question must require deep analytical reasoning or deep technical knowledge.`;
  }

  prompt += ` Ensure the question has 4 plausible options, and only one correct option.`;

  if (alreadyAskedTexts && alreadyAskedTexts.length > 0) {
    prompt += ` Avoid generating any of the following already-asked question texts: ${JSON.stringify(alreadyAskedTexts)}.`;
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
          difficulty: { type: "STRING", description: "Must be 'easy', 'medium', or 'hard'." },
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
  isBossRound: boolean
): Promise<GeminiQuestion | null> {
  // Try 1
  let result = await callGemini(category, difficulty, alreadyAskedTexts, isBossRound);
  if (result && isValidQuestion(result)) {
    return result;
  }
  // Try 2 (Retry once)
  result = await callGemini(category, difficulty, alreadyAskedTexts, isBossRound);
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

    // Fetch from Gemini and Validate
    const geminiResult = await fetchAndValidate(category, difficulty, alreadyAskedTexts, isBossRound);

    if (geminiResult) {
      // Map Gemini fields to expected Question shape
      const responseQuestion = {
        id: "ai_" + Math.random().toString(36).substring(2, 11),
        category: category,
        difficulty: difficulty as "easy" | "medium" | "hard",
        questionText: geminiResult.question,
        options: geminiResult.options,
        correctAnswerIndex: geminiResult.correctAnswerIndex,
        isBossRound: isBossRound || false,
      };

      return NextResponse.json({
        question: responseQuestion,
        source: "gemini",
      });
    } else {
      // Fallback seamlessly to Static Question
      const fallbackQuestion = getFallbackQuestion(
        category,
        difficulty,
        alreadyAskedIds,
        alreadyAskedTexts,
        isBossRound
      );
      return NextResponse.json({
        question: fallbackQuestion,
        source: "static_fallback",
      });
    }
  } catch (error) {
    console.error("Error in generate-question route:", error);
    // Ultimate fallback if JSON parse fails or other unexpected error
    const fallbackQuestion = getFallbackQuestion("programming", "easy", [], [], false);
    return NextResponse.json({
      question: fallbackQuestion,
      source: "error_fallback",
    });
  }
}

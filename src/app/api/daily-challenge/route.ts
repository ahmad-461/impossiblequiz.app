import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { staticQuestions, Question } from "../../../lib/questions";

const CATEGORIES = [
  { id: "programming", name: "Programming" },
  { id: "logic-algorithms", name: "Logic/Algorithms" },
  { id: "data-analytics", name: "Data Analytics" },
  { id: "computer-science-fundamentals", name: "CS Fundamentals" },
  { id: "business", name: "Business" },
  { id: "english", name: "English" }
];

function seedRandom(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function getDeterministicStaticQuestions(category: string, dateString: string): Question[] {
  const rand = seedRandom(dateString);

  const isMatch = (q: Question, cat: string) => {
    if (cat === "business") {
      return q.category.startsWith("business_") || q.category === "business";
    }
    if (cat === "english") {
      return q.category.startsWith("english_") || q.category === "english";
    }
    return q.category === cat;
  };

  const allCategoryQuestions = staticQuestions.filter(q => isMatch(q, category));

  const easyCandidates = allCategoryQuestions.filter(q => q.difficulty === "easy");
  const mediumCandidates = allCategoryQuestions.filter(q => q.difficulty === "medium");
  const hardCandidates = allCategoryQuestions.filter(q => q.difficulty === "hard");

  const selected: Question[] = [];

  // 1 Easy
  if (easyCandidates.length > 0) {
    const idx = Math.floor(rand() * easyCandidates.length);
    selected.push({ ...easyCandidates[idx] });
  }

  // 2 Medium
  const medTemp = [...mediumCandidates];
  for (let i = 0; i < 2; i++) {
    if (medTemp.length > 0) {
      const idx = Math.floor(rand() * medTemp.length);
      selected.push({ ...medTemp[idx] });
      medTemp.splice(idx, 1);
    }
  }

  // 2 Hard
  const hardTemp = [...hardCandidates];
  for (let i = 0; i < 2; i++) {
    if (hardTemp.length > 0) {
      const idx = Math.floor(rand() * hardTemp.length);
      selected.push({ ...hardTemp[idx] });
      hardTemp.splice(idx, 1);
    }
  }

  // Backfill if needed
  while (selected.length < 5 && allCategoryQuestions.length > 0) {
    const idx = Math.floor(rand() * allCategoryQuestions.length);
    selected.push({ ...allCategoryQuestions[idx] });
  }

  return selected;
}

async function callGeminiSingle(category: string, difficulty: string): Promise<{ question: string; options: string[]; correctAnswerIndex: number } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  let prompt = "";
  if (category === "programming") {
    prompt = `Generate ONE multiple-choice quiz question focusing on general Programming concepts (syntax, logic, software patterns, data structures, or code architecture) at '${difficulty}' difficulty. Ensure the question tests conceptual programming knowledge, and is not specific to any single proprietary language (like Rust or C++) so it is broadly accessible to programmers.`;
  } else if (category === "business") {
    prompt = `Generate ONE multiple-choice quiz question focusing on general Business topics (marketing, finance, management, accounting, strategy, or economics) at '${difficulty}' difficulty. Ensure the question tests conceptual business and management knowledge.`;
  } else if (category === "english") {
    prompt = `Generate ONE multiple-choice quiz question focusing on general English concepts (grammar rules, vocabulary, tenses, sentence correction, idioms, or reading comprehension) at '${difficulty}' difficulty. Ensure the concepts tested are highly relevant to advanced English proficiency.`;
  } else {
    prompt = `Generate ONE multiple-choice quiz question for the category '${category}' at '${difficulty}' difficulty.`;
  }

  prompt += ` Ensure the question has exactly 4 options, and only one correct option. Return your response in strict JSON format.`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
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
          }
        },
        required: ["question", "options", "correctAnswerIndex"],
      },
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    return JSON.parse(text);
  } catch (error) {
    console.error(`Gemini call failed for diff ${difficulty}:`, error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET() {
  try {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`;

    const utcDayTimestamp = Date.UTC(yyyy, now.getUTCMonth(), now.getUTCDate());
    const daysSinceEpoch = Math.floor(utcDayTimestamp / (1000 * 60 * 60 * 24));
    const categoryIndex = daysSinceEpoch % 6;
    const currentCategory = CATEGORIES[categoryIndex];

    // Try fetching from Supabase first
    let dbRecord = null;
    try {
      const { data, error } = await supabase
        .from("daily_challenge")
        .select("*")
        .eq("date", dateString)
        .single();
      if (!error && data) {
        dbRecord = data;
      }
    } catch (e) {
      console.warn("Error reading daily challenge from Supabase:", e);
    }

    if (dbRecord) {
      return NextResponse.json({
        date: dateString,
        category: currentCategory.id,
        categoryName: currentCategory.name,
        questions: dbRecord.questions,
        source: "database"
      });
    }

    // Not found in DB, generate a new set of 5 questions (1 Easy, 2 Medium, 2 Hard)
    const apiKey = process.env.GEMINI_API_KEY;
    const questions: Question[] = [];

    if (apiKey) {
      // Fetch in parallel using Promise.all
      const diffs = ["easy", "medium", "medium", "hard", "hard"];
      const promises = diffs.map(diff => callGeminiSingle(currentCategory.id, diff));
      const results = await Promise.all(promises);

      // Construct question objects
      results.forEach((res, index) => {
        const difficulty = diffs[index] as "easy" | "medium" | "hard";
        if (res && res.question && Array.isArray(res.options) && res.options.length === 4 && typeof res.correctAnswerIndex === "number") {
          questions.push({
            id: `ai_daily_${index}_` + Math.random().toString(36).substring(2, 9),
            category: `daily_${currentCategory.id}`,
            difficulty,
            questionText: res.question,
            options: res.options,
            correctAnswerIndex: res.correctAnswerIndex
          });
        }
      });
    }

    // Fill missing slots with deterministic static fallback questions
    if (questions.length < 5) {
      const staticSet = getDeterministicStaticQuestions(currentCategory.id, dateString);
      const diffs = ["easy", "medium", "medium", "hard", "hard"];
      for (let i = 0; i < 5; i++) {
        const expectedDiff = diffs[i];
        // If we don't have a generated question for this index, find a fallback matching the expected difficulty
        if (!questions[i]) {
          const fallback = staticSet.find(q => q.difficulty === expectedDiff && !questions.some(uq => uq.id === q.id)) || staticSet[i];
          questions[i] = {
            ...fallback,
            category: `daily_${currentCategory.id}`
          };
        }
      }
    }

    // Try inserting into Supabase
    try {
      await supabase
        .from("daily_challenge")
        .insert({
          date: dateString,
          category: currentCategory.id,
          questions: questions
        });
    } catch (e) {
      console.warn("Could not insert generated daily challenge into Supabase:", e);
    }

    return NextResponse.json({
      date: dateString,
      category: currentCategory.id,
      categoryName: currentCategory.name,
      questions,
      source: "generated"
    });
  } catch (error) {
    console.error("Critical error in /api/daily-challenge route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

# 🚀 Deployment Guide & Verification Checklist

This document outlines the steps to deploy **The Impossible Quiz Generator** on Vercel and verify that all integrations and fallbacks are functioning correctly.

---

## 📋 1. Vercel Dashboard Environment Variables

Before deploying, configure the following environment variables in your **Vercel Project Settings > Environment Variables**:

| Variable Name | Description | Required | Client-Exposed |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key for real-time question generation. | **Highly Recommended** (falls back to static if missing) | No (Server-only) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project API URL (e.g., `https://xxxx.supabase.co`). | Optional (Phase 5 Leaderboard integration) | Yes (Client-safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous API key. | Optional (Phase 5 Leaderboard integration) | Yes (Client-safe) |

---

## 🛠️ 2. Vercel Project Settings

- **Python Serverless Functions Runtime**:
  - The Python serverless functions are configured in `vercel.json` under `api/`.
  - Vercel automatically detects `.py` files under `/api` and builds them using the `@vercel/python` builder.
  - No special toggles are needed in Vercel settings; Vercel's build pipeline reads the configuration directly from our `vercel.json` and requirements are automatically installed from `requirements.txt`.

---

## 🧪 3. Post-Deployment Verification Checklist

Once the Vercel deployment completes successfully, follow these steps to verify your live site:

### Test 1: Core Quiz Flow
1. Navigate to the homepage of your deployed application.
2. Select any category (e.g., **Programming**).
3. Ensure the quiz page loads instantly.
4. Verify that you can select options, view correctness feedback, lose lives on incorrect selections, and track score and streak.

### Test 2: AI Question Generation (Gemini)
1. Play a quiz session.
2. Check if questions appear dynamic and unique.
3. Open your browser's DevTools Network tab and inspect the response from `/api/generate-question`:
   - Inspect the returned JSON.
   - Confirm that the `source` property is `"gemini"`.
   - Confirm that the `question` payload looks complete and diverse.
4. Reach **Hard** difficulty by getting a 3-question correct streak, and eventually trigger the **Boss Round** to see if the custom boss prompt questions are generated.

### Test 3: Graceful Fallbacks (Robustness Testing)
1. **Fallback 1 (Missing/Invalid Gemini Key)**:
   - Temporarily remove or corrupt the `GEMINI_API_KEY` variable in Vercel's Environment Variables dashboard, and redeploy or trigger a configuration update.
   - Play the quiz.
   - The app should NOT crash or show a loading spinner forever.
   - In the Network tab, inspect the response from `/api/generate-question`. It should return a `source` value of `"static_fallback"` and deliver one of the curated local questions from `src/lib/questions.ts`.
2. **Fallback 2 (Client-Side Difficulty Progression)**:
   - The Vercel Python runtime serves `/api/difficulty-engine`. If this endpoint is ever unavailable or returns an error, the frontend catches the error and falls back immediately to client-side difficulty logic.
   - Verify that difficulty level promotion (increasing on streaks) and demotion (dropping on incorrect answers) still works flawlessly even if the Python function is down or disabled.
3. **Fallback 3 (Supabase Failure)**:
   - If Supabase environment variables are missing or invalid, our database client (`lib/supabase.ts`) catches the error and instantiates a graceful Proxy object instead of throwing an error on import. This prevents the entire Next.js app from crashing, making the app 100% resilient for phase 4.

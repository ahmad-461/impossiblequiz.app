```markdown
# 🧠 The Impossible Quiz Generator

**An AI-powered, adaptive-difficulty trivia platform where every question is forged in real time.**

🔗 **Live:** [impossiblequiz.app](https://impossiblequiz-app.vercel.app/)

---

## Overview

The Impossible Quiz Generator is a full-stack, no-login trivia platform that generates every question live via the Gemini API rather than pulling from a static bank. A dedicated Python difficulty engine tracks player performance in real time and dynamically scales question difficulty — climbing after streaks of correct answers, dropping after mistakes — creating a genuinely adaptive challenge instead of a fixed quiz.

Built as a portfolio project to demonstrate full-stack architecture, AI integration, and product design decisions beyond a typical CRUD app.

---

## ✨ Key Features

- **Real-Time AI Question Generation** — Every question is synthesized live via the Gemini API, with an invisible fallback to a curated static question bank if generation fails
- **Adaptive Difficulty Engine** — A Python serverless service computes difficulty progression (Easy → Medium → Hard → Impossible) based on live answer history
- **6 Categories, Deep Subcategory Trees** — Programming (12 languages), Business (7 subcategories), English (7 subcategories), plus Logic/Algorithms, Data Analytics, and CS Fundamentals
- **Boss Rounds & Impossible Mode** — High-stakes final challenges with distinct win/loss states
- **AI Difficulty Twin** — A simulated AI opponent races the player through the same live question stream in real time, with its own weighted-random performance and a head-to-head results comparison
- **Code Escape Room** — A standalone, narrative-driven 8-room challenge sequence with a global timer and limited retry system
- **Live Leaderboard** — Anonymous, Supabase-backed leaderboard with category-based filtering
- **Dynamic Share Cards** — Auto-generated Open Graph images reflecting each player's actual result, for real link previews
- **Terminal-Styled UI** — A fully custom command-line-inspired navigation and design system, not a template

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v3 |
| AI | Gemini API (question generation) |
| Backend Logic | Python (Vercel serverless) — adaptive difficulty engine |
| Database | Supabase (leaderboard, anonymous session logs) |
| Hosting | Vercel |
| Image Generation | Next.js `ImageResponse` (dynamic OG share cards) |

**Hard constraints maintained throughout:** React 18.3.1 (stable), hex/RGB color values only (no oklch/lab), no login/auth system, no payment integration.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/ahmad-461/impossiblequiz-app.git
cd impossiblequiz-app

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run the dev server
npm run dev
```

Visit `http://localhost:3000`. If `GEMINI_API_KEY` is unset, the app automatically falls back to the static question bank — no crash, no broken state.

---

## 📐 Architecture Highlights

- **Live question generation with graceful degradation** — every AI call has a static fallback, and the fallback itself uses a hierarchical lookup (exact bucket → same subcategory, other difficulty → same sector → whole bank) to avoid repeats even when Gemini is unavailable
- **Consistent category architecture** — all 6 top-level categories share the same Category → (Subcategory) → Difficulty → Quiz flow, whether flat or expandable
- **Client-side AI Twin simulation** — the AI opponent uses weighted-random logic tied to question difficulty rather than a second live API call per question, keeping the feature fast and free to run
- **No user accounts** — every feature (leaderboard, daily-limit style mechanics, twin mode) is designed to work anonymously via session/local storage rather than requiring login

---

## 📌 Project Status

Actively developed across 12+ phases, from initial scaffold through AI integration, category expansion, and ongoing polish/consistency passes. See commit history for the full build log.

---

## 👤 Author

**Muhammad Ahmad Khan**
Computer Science student, Nawaz Sharif University of Agriculture, Multan
Portfolio: [ahmad-khan-build-ship-iterate](https://ahmad-khan-build-ship-iterate-xi.vercel.app/)

---

## 📄 License

This project is available for portfolio and educational reference. Please reach out before reuse in commercial contexts.
```

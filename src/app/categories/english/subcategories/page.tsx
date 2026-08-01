"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Subcategory {
  id: string;
  name: string;
  tag: string;
  description: string;
  icon: React.ReactNode;
}

const subcategories: Subcategory[] = [
  {
    id: "grammar",
    name: "Grammar",
    tag: "ENG.GRM",
    description: "Syntactic dependencies, parts of speech, and structural subject-auxiliary inversions.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    id: "vocabulary",
    name: "Vocabulary",
    tag: "ENG.VOC",
    description: "Greek/Latin prefixes, advanced semantic variations, and sesquipedalian etymologies.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: "synonyms-antonyms",
    name: "Synonyms & Antonyms",
    tag: "ENG.SYN",
    description: "Lexical affinities, semantic relations, fastidious qualifiers, and enantiosemy.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  {
    id: "tenses",
    name: "Tenses",
    tag: "ENG.TEN",
    description: "Chronological timelines, aspectual perfective/imperfective bounds, and conditional structures.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: "sentence-correction",
    name: "Sentence Correction",
    tag: "ENG.SNT",
    description: "Prescriptive syntax, split infinitive resolutions, dangling modifier corrections, and subjunctive moods.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    )
  },
  {
    id: "idioms-phrases",
    name: "Idioms & Phrases",
    tag: "ENG.IDM",
    description: "Figurative etymologies, historical and cultural idiomatic contexts, and classic metaphors.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    id: "reading-comprehension",
    name: "Reading Comprehension",
    tag: "ENG.RDG",
    description: "Hermeneutic analysis, implicit textual inferences, literary devices, and critical theories.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
];

function EnglishSubcategoriesContent() {
  const searchParams = useSearchParams();
  const aiTwin = searchParams.get("aiTwin") === "true";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-6xl mx-auto w-full select-none">
      {/* Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-neonCyan uppercase font-display">
        SELECT_TOPIC // 02
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-3 text-center uppercase">
        ENGLISH{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
          SECTORS
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-12">
        Choose your linguistic domain vector. The system expects high semantic precision.
      </p>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
        {subcategories.map((sub) => {
          const finalHref = `/categories/english/${sub.id}/difficulty?aiTwin=${aiTwin}`;
          return (
            <Link
              key={sub.id}
              href={finalHref}
              aria-label={`Select subcategory: ${sub.name}. Description: ${sub.description}`}
              className="group relative flex flex-col justify-between p-6 rounded-lg bg-bgDark border-2 border-neonViolet/20 hover:border-neonCyan transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:-translate-y-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-neonCyan"
            >
              {/* Left absolute subtle neon glow line */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>

              <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <span>{sub.icon}</span>
                  <span className="text-xs font-display tracking-widest text-neonCyan bg-neonCyan/10 border border-neonCyan/25 px-2.5 py-0.5 rounded font-bold">
                    {sub.tag}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold font-display tracking-wide text-textPrimary group-hover:text-neonCyan transition-colors duration-300 mb-2 uppercase">
                  {sub.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-textMuted leading-relaxed">
                  {sub.description}
                </p>
              </div>

              {/* Action text */}
              <div className="mt-6 flex items-center justify-end text-xs font-bold font-display tracking-wider text-neonViolet group-hover:text-neonCyan transition-colors duration-300 uppercase">
                SELECT COMPILE →
              </div>
            </Link>
          );
        })}
      </div>

      {/* Back to Categories Link */}
      <Link
        href={`/categories?aiTwin=${aiTwin}`}
        className="text-xs font-display tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5 focus:outline-none focus:ring-1 focus:ring-neonViolet"
      >
        ← RETREAT (CATEGORIES)
      </Link>
    </div>
  );
}

export default function EnglishSubcategoriesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-display text-textMuted">LOADING MAINBOARD...</div>}>
      <EnglishSubcategoriesContent />
    </Suspense>
  );
}

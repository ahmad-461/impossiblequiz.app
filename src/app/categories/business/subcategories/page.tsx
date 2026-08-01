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
    id: "marketing",
    name: "Marketing",
    tag: "BUS.MKT",
    description: "Outbound communication, campaigns, conversion funnels, and Veblen effects.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M11 5.882a12.008 12.008 0 014.286-3.18 1 1 0 011.334.914V16.31c0 .77-.512 1.446-1.266 1.603a11.97 11.97 0 01-4.354.512H11m0-12.564L11 18.44" />
      </svg>
    )
  },
  {
    id: "finance",
    name: "Finance",
    tag: "BUS.FIN",
    description: "CAPM frameworks, options Greeks, replicating portfolios, and asset markets.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    id: "accounting",
    name: "Accounting",
    tag: "BUS.ACT",
    description: "Fundamental ledger equations, depreciation methods, and regulatory GAAP/IFRS standards.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    tag: "BUS.ENT",
    description: "MVP validated learning, cap tables, SAFE instruments, and liquidation preferences.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: "management",
    name: "Management",
    tag: "BUS.MGT",
    description: "Organizational structures, Herzberg hygiene theories, and Mintzberg decisional roles.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: "economics",
    name: "Economics",
    tag: "BUS.ECO",
    description: "Classical law of demand, GDP variations, market structures, and exchange models.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    id: "business-strategy",
    name: "Business Strategy",
    tag: "BUS.STG",
    description: "SWOT planning matrix, Porter's Five Forces, and RBV causal ambiguities.",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

function BusinessSubcategoriesContent() {
  const searchParams = useSearchParams();
  const aiTwin = searchParams.get("aiTwin") === "true";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-6xl mx-auto w-full select-none">
      {/* Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-neonCyan uppercase font-display">
        SELECT_TOPIC // 02
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-3 text-center uppercase">
        BUSINESS{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
          SECTORS
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-12">
        Choose your professional domain vector. The system expects high execution fidelity.
      </p>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
        {subcategories.map((sub) => {
          const finalHref = `/categories/business/${sub.id}/difficulty?aiTwin=${aiTwin}`;
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

export default function BusinessSubcategoriesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-display text-textMuted">LOADING MAINBOARD...</div>}>
      <BusinessSubcategoriesContent />
    </Suspense>
  );
}

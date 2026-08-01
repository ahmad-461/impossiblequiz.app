import React from "react";

export interface Category {
  id: string;
  title: string;
  desc: string;
  tag: string;
  isExpandable: boolean;
  actionLabel: string;
  href: string;
  icon: React.ReactNode;
}

export const categories: Category[] = [
  {
    id: "programming",
    title: "Programming",
    desc: "Syntax, edge cases, language quirks, and design patterns.",
    tag: "SYS.LANG",
    isExpandable: true,
    actionLabel: "→ SELECT LANGUAGE",
    href: "/categories/programming/languages",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "business",
    title: "Business",
    desc: "Marketing funnels, financial modeling, accounting standards, and strategic game theory.",
    tag: "BUS.MGMT",
    isExpandable: true,
    actionLabel: "→ SELECT TOPIC",
    href: "/categories/business/subcategories",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "english",
    title: "English",
    desc: "Syntax rules, advanced vocabulary, tenses, figurative idioms, and reading comprehension.",
    tag: "ENG.LANG",
    isExpandable: true,
    actionLabel: "→ SELECT TOPIC",
    href: "/categories/english/subcategories",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5c-1.043 2.56-2.5 5-4.251 7.148m1.205-2.518a24.232 24.232 0 003.046-5.03" />
      </svg>
    ),
  },
  {
    id: "logic-algorithms",
    title: "Logic/Algorithms",
    desc: "Asymptotic complexity, graph theory, and mathematical proofs.",
    tag: "ALG.COMP",
    isExpandable: false,
    actionLabel: "ENTER SYSTEM →",
    href: "/quiz?category=logic-algorithms",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="12" r="2.5" />
        <circle cx="12" cy="19" r="2.5" />
        <path d="M12 7.5v9M7.5 12.5h9M10.2 6.8l-2.4 3.4M13.8 6.8l2.4 3.4M7.8 13.8l2.4 3.4M16.2 13.8l-2.4 3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    desc: "Statistics, database query planning, and data pipeline scale.",
    tag: "DAT.SCALE",
    isExpandable: false,
    actionLabel: "ENTER SYSTEM →",
    href: "/quiz?category=data-analytics",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  },
  {
    id: "computer-science-fundamentals",
    title: "Computer Science Fundamentals",
    desc: "CPU architectures, memory virtualization, and networking protocols.",
    tag: "SYS.CORE",
    isExpandable: false,
    actionLabel: "ENTER SYSTEM →",
    href: "/quiz?category=computer-science-fundamentals",
    icon: (
      <svg className="w-10 h-10 text-neonCyan group-hover:text-neonViolet transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="14" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

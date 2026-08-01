import Link from "next/link";

interface PageProps {
  params: Promise<{ subcategory: string }>;
}

const formatSubcategoryName = (id: string): string => {
  const mapping: Record<string, string> = {
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    "synonyms-antonyms": "Synonyms & Antonyms",
    tenses: "Tenses",
    "sentence-correction": "Sentence Correction",
    "idioms-phrases": "Idioms & Phrases",
    "reading-comprehension": "Reading Comprehension",
  };
  return mapping[id.toLowerCase()] || id.toUpperCase();
};

export default async function EnglishDifficultyPage({ params }: PageProps) {
  const { subcategory } = await params;
  const formattedSub = formatSubcategoryName(subcategory);

  const tiers = [
    {
      id: "easy",
      name: "EASY",
      tag: "LEVEL_01",
      lives: "3 SHIELDS",
      timer: "30s COUNTDOWN",
      rules: "Adaptive promotion",
      desc: "Infiltrate basic fundamentals, core definitions, and elementary grammatical rules.",
      style: "border-neonCyan/20 hover:border-neonCyan hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]",
      badgeStyle: "text-neonCyan bg-neonCyan/10 border-neonCyan/25",
    },
    {
      id: "medium",
      name: "MEDIUM",
      tag: "LEVEL_02",
      lives: "3 SHIELDS",
      timer: "30s COUNTDOWN",
      rules: "Adaptive promotion/demotion",
      desc: "Encounter complex sentence constructions, historical idioms, and intermediate semantic variations.",
      style: "border-neonCyan/20 hover:border-neonCyan hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]",
      badgeStyle: "text-neonCyan bg-neonCyan/10 border-neonCyan/25",
    },
    {
      id: "hard",
      name: "HARD",
      tag: "LEVEL_03",
      lives: "3 SHIELDS",
      timer: "30s COUNTDOWN",
      rules: "Adaptive demotion / Boss round enabled",
      desc: "Survive extreme literary analyses, advanced syntax errors, and obscure word connections.",
      style: "border-neonViolet/20 hover:border-neonViolet hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      badgeStyle: "text-neonViolet bg-neonViolet/10 border-neonViolet/25",
    },
    {
      id: "impossible",
      name: "IMPOSSIBLE",
      tag: "LVL_DEATH",
      lives: "1 SHIELD (SINGLE-LIFE)",
      timer: "15s COUNTDOWN (BRUTAL)",
      rules: "NO DEMOTION PATH // NO SAFEPAGE",
      desc: "The ultimate trial. Master linguistic rules, subject-auxiliary inversions, and advanced literary criticism frameworks.",
      style: "border-neonViolet border-2 bg-gradient-to-b from-[#150a25] to-bgDark hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] animate-pulse",
      badgeStyle: "text-neonViolet bg-neonViolet/20 border-neonViolet/50 font-black animate-pulse",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-6xl mx-auto w-full select-none">
      {/* Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonViolet/10 border border-neonViolet/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-neonViolet uppercase font-display">
        SELECT_SECTOR // 03
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-3 text-center uppercase">
        {formattedSub} {"// " }
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          DIFFICULTY
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-12">
        Select your system authorization tier for {formattedSub}. Linguistic threat levels escalate rapidly.
      </p>

      {/* Difficulty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {tiers.map((tier) => (
          <Link
            key={tier.id}
            href={`/quiz?category=english_${subcategory}_${tier.id}`}
            aria-label={`Select difficulty ${tier.name}. ${tier.desc}`}
            className={`group relative flex flex-col justify-between p-6 rounded-lg bg-bgDark border transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-neonCyan hover:-translate-y-1 ${tier.style}`}
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              tier.id === "impossible" ? "bg-neonViolet" : "bg-neonCyan group-hover:bg-neonViolet"
            } transition-colors duration-300`}></div>

            {tier.id === "impossible" && (
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neonViolet"></div>
            )}

            <div>
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-display tracking-widest px-2 py-0.5 rounded border ${tier.badgeStyle}`}>
                  {tier.tag}
                </span>
                {tier.id === "impossible" && (
                  <span className="text-[10px] font-display font-black tracking-widest text-neonViolet animate-ping">
                    ⚠️ DANGER
                  </span>
                )}
              </div>

              {/* Tier Name */}
              <h3 className={`text-2xl font-black font-display tracking-wide group-hover:text-neonCyan transition-colors duration-300 mb-2 ${
                tier.id === "impossible" ? "text-neonViolet" : "text-textPrimary"
              }`}>
                {tier.name}
              </h3>

              {/* Constraints info list */}
              <div className="flex flex-col gap-1 mb-4 text-xs font-mono text-textMuted">
                <div className="flex items-center gap-1.5">
                  <span className="text-neonCyan">🛡️</span>
                  <span>{tier.lives}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neonCyan">⏱️</span>
                  <span>{tier.timer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neonCyan">⚙️</span>
                  <span className="text-textPrimary font-bold">{tier.rules}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-textMuted leading-relaxed">
                {tier.desc}
              </p>
            </div>

            {/* Simulated Action */}
            <div className="mt-6 flex items-center justify-end text-xs font-bold font-display tracking-wider text-neonViolet group-hover:text-neonCyan transition-colors duration-300 uppercase">
              INITIALIZE PORTAL →
            </div>
          </Link>
        ))}
      </div>

      {/* Back to Subcategories Link */}
      <Link
        href="/categories/english/subcategories"
        className="text-xs font-display tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5 focus:outline-none focus:ring-1 focus:ring-neonViolet"
      >
        ← BACK TO ENGLISH SECTORS
      </Link>
    </div>
  );
}

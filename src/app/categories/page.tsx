import Link from "next/link";

const categories = [
  {
    id: "programming",
    emoji: "🖥️",
    title: "Programming",
    desc: "Syntax, edge cases, language quirks, and design patterns.",
    tag: "SYS.LANG",
  },
  {
    id: "logic-algorithms",
    emoji: "🧩",
    title: "Logic/Algorithms",
    desc: "Asymptotic complexity, graph theory, and mathematical proofs.",
    tag: "ALG.COMP",
  },
  {
    id: "data-analytics",
    emoji: "📊",
    title: "Data Analytics",
    desc: "Statistics, database query planning, and data pipeline scale.",
    tag: "DAT.SCALE",
  },
  {
    id: "computer-science-fundamentals",
    emoji: "⚙️",
    title: "Computer Science Fundamentals",
    desc: "CPU architectures, memory virtualization, and networking protocols.",
    tag: "SYS.CORE",
  },
];

export default function CategoriesPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-6xl mx-auto w-full select-none">
      {/* Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-neonCyan uppercase font-mono">
        SELECT_SECTOR // 01
      </div>

      <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-center">
        CHOOSE YOUR{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
          BATTLEGROUND
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-12">
        Each sector demands extreme competence. Once entered, the simulation begins immediately. Choose wisely.
      </p>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/quiz?category=${cat.id}`}
            className="group relative flex flex-col justify-between p-6 rounded-lg bg-bgDark border-2 border-neonViolet/20 hover:border-neonCyan transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:-translate-y-1 overflow-hidden"
          >
            {/* Background absolute subtle neon line */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>

            <div>
              {/* Category Header */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl">{cat.emoji}</span>
                <span className="text-xs font-mono tracking-widest text-neonCyan bg-neonCyan/10 border border-neonCyan/25 px-2 py-0.5 rounded">
                  {cat.tag}
                </span>
              </div>

              {/* Category Title */}
              <h3 className="text-xl font-bold tracking-wide text-textPrimary group-hover:text-neonCyan transition-colors duration-300 mb-2">
                {cat.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-textMuted leading-relaxed">
                {cat.desc}
              </p>
            </div>

            {/* Simulated Action */}
            <div className="mt-6 flex items-center justify-end text-xs font-bold tracking-wider text-neonViolet group-hover:text-neonCyan transition-colors duration-300 uppercase">
              ENTER SYSTEM →
            </div>
          </Link>
        ))}
      </div>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="text-xs font-mono tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5"
      >
        ← ABANDON MISSION (HOME)
      </Link>
    </div>
  );
}

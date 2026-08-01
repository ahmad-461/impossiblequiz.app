import Link from "next/link";

interface Language {
  id: string;
  name: string;
  tag: string;
  description: string;
}

const languages: Language[] = [
  { id: "python", name: "Python", tag: "PY.CORE", description: "Interpreter & Scripting Engine" },
  { id: "java", name: "Java", tag: "JVM.OS", description: "Object-Oriented Enterprise Platform" },
  { id: "javascript", name: "JavaScript", tag: "V8.ENGINE", description: "Dynamic JIT Scripting Runtime" },
  { id: "c", name: "C", tag: "OS.KERNEL", description: "Bare-Metal Systems Development" },
  { id: "cpp", name: "C++", tag: "CPP.COMP", description: "High-Performance Systems & Objects" },
  { id: "csharp", name: "C#", tag: "DOT.NET", description: "Cross-Platform Framework & Services" },
  { id: "php", name: "PHP", tag: "PHP.WEB", description: "Server-Side Web Preprocessor" },
  { id: "typescript", name: "TypeScript", tag: "TS.STRICT", description: "Statically Typed Super-Set of JS" },
  { id: "go", name: "Go", tag: "GMP.SCHED", description: "Statically Typed Compiled Services" },
  { id: "rust", name: "Rust", tag: "RUST.MEM", description: "Memory Safe Systems Language" },
  { id: "kotlin", name: "Kotlin", tag: "KT.JVM", description: "Modern Statically Typed JVM Language" },
  { id: "swift", name: "Swift", tag: "SWIFT.IOS", description: "Native iOS/macOS Development" },
];

export default function LanguagesPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-6xl mx-auto w-full select-none">
      {/* Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-neonCyan uppercase font-display">
        SELECT_LANGUAGE // 02
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-3 text-center uppercase">
        SELECT YOUR{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
          WEAPON
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-12">
        Choose the language compiler you will infiltrate. The mainframe expects native compatibility.
      </p>

      {/* Languages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
        {languages.map((lang) => (
          <Link
            key={lang.id}
            href={`/categories/programming/${lang.id}/difficulty`}
            aria-label={`Select language: ${lang.name}. Description: ${lang.description}`}
            className="group relative flex flex-col justify-between p-6 rounded-lg bg-bgDark border-2 border-neonViolet/20 hover:border-neonCyan transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:-translate-y-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-neonCyan"
          >
            {/* Left absolute subtle neon glow line */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>

            <div>
              {/* Language Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-display tracking-widest text-neonCyan bg-neonCyan/10 border border-neonCyan/25 px-2.5 py-0.5 rounded font-bold">
                  {lang.tag}
                </span>
                <span className="text-[10px] font-mono text-neonViolet/50 group-hover:text-neonCyan/50 transition-colors duration-300 font-bold uppercase">
                  ACTIVE_SYS
                </span>
              </div>

              {/* Language Name */}
              <h3 className="text-xl font-bold font-display tracking-wide text-textPrimary group-hover:text-neonCyan transition-colors duration-300 mb-2 uppercase">
                {lang.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-textMuted leading-relaxed">
                {lang.description}
              </p>
            </div>

            {/* Action text */}
            <div className="mt-6 flex items-center justify-end text-xs font-bold font-display tracking-wider text-neonViolet group-hover:text-neonCyan transition-colors duration-300 uppercase">
              SELECT COMPILE →
            </div>
          </Link>
        ))}
      </div>

      {/* Back to Categories Link */}
      <Link
        href="/categories"
        className="text-xs font-display tracking-widest text-textMuted hover:text-neonViolet transition-colors duration-200 uppercase border-b border-textMuted/20 hover:border-neonViolet/50 pb-0.5 focus:outline-none focus:ring-1 focus:ring-neonViolet"
      >
        ← RETREAT (CATEGORIES)
      </Link>
    </div>
  );
}

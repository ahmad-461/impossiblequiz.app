import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center select-none">
      {/* Hero Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonViolet/10 border border-neonViolet/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-neonViolet uppercase">
        ⚡ Welcome to the Arena ⚡
      </div>

      {/* Main Branding */}
      <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
        TEST YOUR LIMITS IN THE{" "}
        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          IMPOSSIBLE QUIZ
        </span>
      </h1>

      {/* Subtext */}
      <p className="text-textMuted max-w-xl text-base md:text-lg mb-10 leading-relaxed">
        An ultra-hard, competitive-style knowledge trial designed for top developers and engineers. Do you have what it takes to climb the scoreboard?
      </p>

      {/* CTA Button */}
      <Link
        href="/categories"
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold tracking-widest uppercase transition-all duration-300 rounded-md bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none focus:ring-2 focus:ring-neonCyan shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] border border-transparent hover:border-neonCyan"
      >
        {/* Glow effect overlay */}
        <span className="absolute inset-0 w-full h-full rounded-md bg-gradient-to-r from-neonViolet to-neonCyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></span>
        START QUIZ
      </Link>

      {/* Futuristic status items */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 max-w-2xl border-t border-neonViolet/10 pt-8 w-full">
        <div>
          <div className="text-2xl font-bold text-neonCyan font-mono">04</div>
          <div className="text-xs uppercase tracking-widest text-textMuted mt-1">Sectors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-neonViolet font-mono">100%</div>
          <div className="text-xs uppercase tracking-widest text-textMuted mt-1">Difficulty</div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-2xl font-bold text-neonCyan font-mono">LIVE</div>
          <div className="text-xs uppercase tracking-widest text-textMuted mt-1">Leaderboards</div>
        </div>
      </div>
    </div>
  );
}

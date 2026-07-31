import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center select-none relative overflow-hidden">
      {/* Decorative cybernetic lines/glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neonViolet/5 blur-3xl pointer-events-none -z-10"></div>

      {/* Hero Badge */}
      <div className="mb-6 inline-flex items-center gap-2 bg-neonViolet/10 border border-neonViolet/30 px-4 py-1.5 rounded-full text-xs font-bold font-display tracking-widest text-neonViolet uppercase">
        ⚡ Welcome to the Arena ⚡
      </div>

      {/* Main Branding */}
      <h1 className="text-4xl md:text-7xl font-black font-display tracking-tight mb-6 max-w-4xl leading-tight">
        TEST YOUR LIMITS IN THE{" "}
        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          IMPOSSIBLE QUIZ
        </span>
      </h1>

      {/* Subtext */}
      <p className="text-textMuted max-w-xl text-sm md:text-base mb-10 leading-relaxed">
        An ultra-hard, competitive-style knowledge trial designed for top developers and engineers. Powered by an adaptive difficulty engine and dynamic real-time AI question synthesis. Do you have what it takes to survive the Boss Round?
      </p>

      {/* CTA Button */}
      <Link
        href="/categories"
        className="group relative inline-flex items-center justify-center px-10 py-4.5 text-base md:text-lg font-black font-display tracking-widest uppercase transition-all duration-300 rounded bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none focus:ring-2 focus:ring-neonCyan shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] border border-transparent hover:border-neonCyan overflow-hidden"
      >
        {/* Glow effect overlay */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neonViolet to-neonCyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></span>
        START QUIZ
      </Link>

      {/* Futuristic status items */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 max-w-2xl border-t border-neonViolet/10 pt-8 w-full">
        <div>
          <div className="text-2xl md:text-3xl font-black text-neonCyan font-display">04</div>
          <div className="text-[10px] uppercase tracking-widest text-textMuted mt-1 font-semibold">Sectors Available</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-black text-neonViolet font-display">100%</div>
          <div className="text-[10px] uppercase tracking-widest text-textMuted mt-1 font-semibold">Difficulty Vector</div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-2xl md:text-3xl font-black text-neonCyan font-display">LIVE</div>
          <div className="text-[10px] uppercase tracking-widest text-textMuted mt-1 font-semibold">Leaderboards</div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-20 w-full max-w-4xl border-t border-neonViolet/15 pt-12">
        <h2 className="text-xs font-black font-display tracking-widest text-neonCyan uppercase mb-8 text-center">
          SYSTEM_ARCHITECTURE // FEATURES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Feature 1 */}
          <div className="p-5 rounded bg-bgDark border border-neonViolet/20 shadow-[0_0_10px_rgba(168,85,247,0.02)] hover:border-neonCyan hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all duration-300 relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>
            <div className="text-xs font-display font-black text-neonCyan uppercase tracking-wider mb-2">
              01 // DYNAMIC GENERATION
            </div>
            <p className="text-xs text-textMuted leading-relaxed">
              Every question is generated in real time — no two playthroughs are the same.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded bg-bgDark border border-neonViolet/20 shadow-[0_0_10px_rgba(168,85,247,0.02)] hover:border-neonCyan hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all duration-300 relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>
            <div className="text-xs font-display font-black text-neonCyan uppercase tracking-wider mb-2">
              02 // ADAPTIVE ENGINE
            </div>
            <p className="text-xs text-textMuted leading-relaxed">
              Performance-driven difficulty scaling powered by a dedicated AI engine.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded bg-bgDark border border-neonViolet/20 shadow-[0_0_10px_rgba(168,85,247,0.02)] hover:border-neonCyan hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all duration-300 relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-neonViolet group-hover:bg-neonCyan transition-colors duration-300"></div>
            <div className="text-xs font-display font-black text-neonCyan uppercase tracking-wider mb-2">
              03 // HALL OF CHAMPIONS
            </div>
            <p className="text-xs text-textMuted leading-relaxed">
              Compete for the top spot on the live leaderboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

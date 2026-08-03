import { Metadata } from "next";
import NextLink from "next/link";

export const metadata: Metadata = {
  title: "About the AI & Mainframe Methodology — The Impossible Quiz",
  description: "Learn about the architecture behind The Impossible Quiz Generator. Built by Muhammad Ahmad Khan, explore how real-time Gemini question generation and Python adaptive difficulty work.",
  keywords: ["about the quiz", "muhammad ahmad khan", "how it works", "gemini ai integration", "adaptive difficulty engine"],
  authors: [{ name: "Muhammad Ahmad Khan" }],
  openGraph: {
    title: "About the AI & Mainframe Methodology — The Impossible Quiz",
    description: "Honest technical breakdown of our real-time AI question generation, structural validation layer, and zero-data anonymous privacy policy.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full select-none animate-page-fade">
      {/* Decorative Floating Atmospheric Circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
        <div className="w-[450px] h-[450px] rounded-full bg-gradient-to-r from-neonViolet/5 to-neonCyan/5 blur-3xl"></div>
      </div>

      {/* Header Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-neonCyan uppercase font-display">
        SYSTEM_ABOUT // INFO_VECTOR
      </div>

      <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-4 text-center uppercase">
        ABOUT THE{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonViolet to-neonCyan drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          MAINFRAME
        </span>
      </h1>

      <p className="text-textMuted max-w-xl text-center text-sm md:text-base mb-12 leading-relaxed">
        An honest, transparent breakdown of the technology, authorship, and structural guidelines governing our adaptive trivia engine.
      </p>

      {/* Structured Info Sections */}
      <div className="w-full space-y-8 font-mono text-xs md:text-sm">

        {/* Section 1: Authorship & Expertise */}
        <div className="p-6 rounded-lg bg-bgDark border-2 border-neonViolet/20 shadow-[0_0_12px_rgba(168,85,247,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-neonViolet"></div>
          <span className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-3 block">
            [ 01 // OPERATOR AUTHORSHIP ]
          </span>
          <h2 className="text-lg font-bold font-display text-textPrimary uppercase mb-4">Muhammad Ahmad Khan</h2>
          <div className="space-y-3 leading-relaxed text-textMuted text-xs md:text-sm">
            <p>
              This platform was fully designed, engineered, and built by <span className="text-neonCyan font-bold">Muhammad Ahmad Khan</span>, a Computer Science student at Nawaz Sharif University of Agriculture, Multan.
            </p>
            <p>
              Constructed as a high-fidelity demonstration of full-stack AI integration, the project is a portfolio showcase illustrating complex product decisions beyond traditional CRUD applications.
            </p>
            <p className="pt-2">
              <a
                href="https://ahmad-khan-build-ship-iterate-xi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-neonCyan font-bold hover:text-neonViolet transition-all duration-300 ease-in-out border-b border-neonCyan/30 hover:border-neonViolet/50 pb-0.5"
              >
                &gt; VISIT PORTFOLIO CARD
              </a>
            </p>
          </div>
        </div>

        {/* Section 2: Technical Methodology */}
        <div className="p-6 rounded-lg bg-bgDark border-2 border-neonViolet/20 shadow-[0_0_12px_rgba(168,85,247,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-neonViolet"></div>
          <span className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-3 block">
            [ 02 // REAL-TIME SYNTHESIS & METHODOLOGY ]
          </span>
          <h2 className="text-lg font-bold font-display text-textPrimary uppercase mb-4">How This Works // Gemini AI Core</h2>
          <div className="space-y-4 leading-relaxed text-textMuted text-xs md:text-sm">
            <p>
              Unlike conventional static quizzes, every question in our mainframe is forged live on-demand via the <span className="text-neonCyan font-bold">Gemini API</span>. This ensures an endless stream of unique, non-repeating trivia.
            </p>
            <div>
              <p className="text-textPrimary font-bold uppercase mb-1">&gt; STRUCTURAL VALIDATION LAYER</p>
              <p>
                To avoid AI hallucination crashes, a robust validation layer intercepts every response. The system guarantees exactly 4 non-empty options, a valid correct answer index, and a minimum length for question text.
              </p>
            </div>
            <div>
              <p className="text-textPrimary font-bold uppercase mb-1">&gt; GRACEFUL DEGRADATION FALLBACK</p>
              <p>
                If API keys are exhausted or network latency thresholds are tripped, the system silently degrades to a dynamic hierarchical local pool. It scans exact subcategories, adjacent difficulties, and parent sectors to retrieve unasked questions without breaking user sessions.
              </p>
            </div>
            <div>
              <p className="text-textPrimary font-bold uppercase mb-1">&gt; PYTHON DIFFICULTY PROGRESSION</p>
              <p>
                A serverless Python service monitors performance logs. Correct streak metrics trigger promotions (Easy → Medium → Hard → Impossible), and mistakes trigger demotions, optimizing the academic challenge curve.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Honest Limitations */}
        <div className="p-6 rounded-lg bg-bgDark border-2 border-neonViolet/20 shadow-[0_0_12px_rgba(168,85,247,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-neonViolet"></div>
          <span className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-3 block">
            [ 03 // TRANSPARENCY & LIMITATIONS ]
          </span>
          <h2 className="text-lg font-bold font-display text-textPrimary uppercase mb-4">Factual Limits &amp; AI Scope</h2>
          <div className="space-y-3 leading-relaxed text-textMuted text-xs md:text-sm">
            <p>
              We operate under a code of absolute transparency. While the structural validation layer is mathematically rigid, <span className="text-neonViolet font-bold">absolute factual accuracy at extreme difficulties is not 100% guaranteed</span>.
            </p>
            <p>
              At the &quot;Impossible&quot; difficulty, Gemini may synthesise deeply niche specifications or highly controversial language compiler quirks. This is the nature of live generative modeling; we advise players to treat discrepancies as constructive system anomalies.
            </p>
          </div>
        </div>

        {/* Section 4: Privacy Policy */}
        <div className="p-6 rounded-lg bg-bgDark border-2 border-neonViolet/20 shadow-[0_0_12px_rgba(168,85,247,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-neonViolet"></div>
          <span className="text-[10px] font-display font-black text-neonCyan uppercase tracking-widest mb-3 block">
            [ 04 // DATA HANDLING DISCLOSURE ]
          </span>
          <h2 className="text-lg font-bold font-display text-textPrimary uppercase mb-4">Privacy &amp; Telemetry Policy</h2>
          <div className="space-y-3 leading-relaxed text-textMuted text-xs md:text-sm">
            <p>
              The Impossible Quiz Generator enforces a strict, zero-friction, <span className="text-neonCyan font-bold">no-login standard</span>. We do not prompt or store names, email addresses, passwords, or tracking identifiers.
            </p>
            <p>
              Leaderboard submissions are strictly voluntary, public, and accept anonymous handles only. No personal telemetry is transmitted, and HTTPS encryption is enforced programmatically across all route networks to protect public interactions.
            </p>
          </div>
        </div>

      </div>

      {/* Return to Core CTA */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center w-full">
        <NextLink
          href="/categories"
          className="group relative inline-flex items-center justify-center px-8 py-4 text-xs font-black font-display tracking-widest uppercase transition-all duration-300 rounded bg-neonViolet text-textPrimary hover:bg-neonViolet/90 focus:outline-none focus:ring-2 focus:ring-neonCyan shadow-[0_0_12px_rgba(168,85,247,0.4)] hover:shadow-[0_0_22px_rgba(34,211,238,0.6)] border border-transparent hover:border-neonCyan text-center"
        >
          START THE QUIZ
        </NextLink>

        <NextLink
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 text-xs font-black font-display tracking-widest uppercase transition-all duration-300 rounded border border-neonCyan/25 hover:border-neonCyan bg-bgDark hover:bg-neonCyan/5 text-neonCyan focus:outline-none focus:ring-2 focus:ring-neonCyan text-center"
        >
          RETURN HOME
        </NextLink>
      </div>
    </div>
  );
}

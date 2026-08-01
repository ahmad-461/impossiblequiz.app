"use client";

interface AITwinToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function AITwinToggle({ enabled, onChange }: AITwinToggleProps) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      style={{
        backgroundColor: "#0a0b10",
        borderColor: enabled ? "#22d3ee" : "rgba(168, 85, 247, 0.2)",
        boxShadow: enabled ? "0 0 15px rgba(34, 211, 238, 0.15)" : "none",
      }}
      className="w-full max-w-2xl p-4 md:p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 select-none mb-8 focus:outline-none focus:ring-2 focus:ring-neonCyan"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!enabled);
        }
      }}
      aria-label={`Toggle AI Twin Mode. Currently ${enabled ? "enabled" : "disabled"}.`}
    >
      <div className="flex items-start gap-3.5 text-left w-full sm:w-auto">
        <span className={`text-2xl shrink-0 transition-transform duration-300 ${enabled ? "scale-110 filter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" : "opacity-40"}`}>
          🤖
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-xs md:text-sm font-black font-display tracking-wider uppercase transition-colors duration-300 ${enabled ? "text-neonCyan" : "text-textPrimary"}`}>
              AI TWIN MODE // {enabled ? "ONLINE" : "OFFLINE"}
            </span>
            {enabled && (
              <span className="w-2 h-2 rounded-full bg-neonCyan animate-ping"></span>
            )}
          </div>
          <span className="text-[11px] md:text-xs text-textMuted mt-1 leading-relaxed max-w-md">
            Simulate high-fidelity combat against a parallel AI difficulty twin. Answers the exact same question stream in real time with weighted response speeds and accuracy!
          </span>
        </div>
      </div>

      {/* Cyberpunk styled switch */}
      <div className="shrink-0 flex items-center gap-2">
        <span className={`text-[10px] font-display font-black tracking-widest ${enabled ? "text-neonCyan" : "text-textMuted/40"} transition-colors duration-300`}>
          OFF
        </span>
        <div
          style={{
            borderColor: enabled ? "#22d3ee" : "rgba(168, 85, 247, 0.4)",
          }}
          className="w-12 h-6 rounded-full border relative transition-colors duration-300 bg-black/60"
        >
          <div
            style={{
              backgroundColor: enabled ? "#22d3ee" : "#a855f7",
              boxShadow: enabled ? "0 0 8px rgba(34, 211, 238, 0.8)" : "none",
              left: enabled ? "24px" : "4px",
            }}
            className="w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300"
          ></div>
        </div>
        <span className={`text-[10px] font-display font-black tracking-widest ${enabled ? "text-neonCyan animate-pulse" : "text-textMuted/40"} transition-colors duration-300`}>
          ON
        </span>
      </div>
    </div>
  );
}

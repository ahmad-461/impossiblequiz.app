import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: "#0a0b10",
        neonViolet: "#a855f7",
        neonCyan: "#22d3ee",
        textPrimary: "#f5f5f5",
        textMuted: "#9ca3af",
      },
    },
  },
  plugins: [],
};
export default config;

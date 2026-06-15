import type { Config } from "tailwindcss";

// Brand tokens — maroon + gold + cream. Sab design yahi se chalta hai.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: "#8B1E3F", dark: "#6B1430", deep: "#4A0E22" },
        gold: { DEFAULT: "#C9A24B", light: "#E4CB87", dark: "#A07F33" },
        cream: "#FBF6EE",
        ink: "#2A1820",
        muted: "#7A6B70",
        line: "#EADFD2",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-mukta)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(74,14,34,0.04)",
        lift: "0 14px 30px -12px rgba(74,14,34,0.18)",
        gold: "0 8px 24px -8px rgba(201,162,75,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;

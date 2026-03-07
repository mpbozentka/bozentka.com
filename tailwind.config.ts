import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        primary: "var(--primary)",
        "primary-foreground": "#FAF9F5",
        carbon: "#141413",
        stone: "#B0AEA5",
        terracotta: "#D97757",
        "warm-alabaster": "#FAF9F5",
        bitcoin: "#F7931A",
        "accent-blue": "#007AFF",
        ink: "#1a1a1a",
        "background-light": "#f7f7f7",
        "background-dark": "#191919",
      },
      fontFamily: {
        sans: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

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
        "background-light": "#FAF9F5",
        "background-dark": "#141413",
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

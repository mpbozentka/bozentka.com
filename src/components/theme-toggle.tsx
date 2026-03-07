"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bozentka-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null)) || "light";
    const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    document.documentElement.classList.toggle("dark", resolved === "dark");
    setTheme(resolved);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors size-10"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
    >
      {theme === "light" ? (
        <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
          dark_mode
        </span>
      ) : (
        <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
          light_mode
        </span>
      )}
    </button>
  );
}

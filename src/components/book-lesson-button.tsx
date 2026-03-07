"use client";

import { siteConfig } from "@/lib/site-config";

export function BookLessonButton() {
  return (
    <a
      href={siteConfig.scheduleExternalHref}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
    >
      Book a lesson with me!
    </a>
  );
}

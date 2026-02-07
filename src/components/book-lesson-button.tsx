"use client";

const CALENDAR_URL =
  "https://calendar.google.com/calendar/appointments/AcZssZ1wrWc2kovHxpzVnEe48c354w0BnjPfXdJBbL4=?gv=true";

export function BookLessonButton() {
  return (
    <a
      href={CALENDAR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
    >
      Book a lesson with me!
    </a>
  );
}

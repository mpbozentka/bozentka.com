import Link from "next/link";
import { FlaskConical } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 transition-opacity hover:opacity-90"
      aria-label="Bozentka Labs – Home"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
        <FlaskConical className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="font-semibold tracking-tight text-white">
        Bozentka <span className="text-emerald-400">Labs</span>
      </span>
    </Link>
  );
}

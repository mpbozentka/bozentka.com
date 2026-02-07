import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/50 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-6">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-emerald-400"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-emerald-400"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="mailto:hello@bozentka.com"
            className="text-slate-400 transition-colors hover:text-emerald-400"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          © 2026 Bozentka Labs. Austin, Texas.
        </p>
      </div>
    </footer>
  );
}

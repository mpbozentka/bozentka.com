import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">wb_twilight</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-primary">
            Mitchell Bozentka
          </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/blog">
            Writing
          </Link>
          <a
            className="text-sm font-semibold hover:text-primary transition-colors"
            href={siteConfig.scheduleExternalHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Schedule
          </a>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/#about">
            About
          </Link>
          <a
            className="text-sm font-semibold hover:text-primary transition-colors border-l border-primary/20 pl-8"
            href={siteConfig.deployCta.href}
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

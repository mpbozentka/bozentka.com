"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sunrise } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Sunrise className="size-5" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-primary">
            Mitchell Bozentka
          </h1>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/blog">
            Writing
          </Link>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/projects">
            Projects
          </Link>
          <a
            className="text-sm font-semibold hover:text-primary transition-colors"
            href={siteConfig.scheduleExternalHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Schedule
          </a>
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/bio">
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
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-primary/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-primary/10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link
              className="text-sm font-semibold hover:text-primary transition-colors py-2"
              href="/blog"
              onClick={() => setMobileOpen(false)}
            >
              Writing
            </Link>
            <Link
              className="text-sm font-semibold hover:text-primary transition-colors py-2"
              href="/projects"
              onClick={() => setMobileOpen(false)}
            >
              Projects
            </Link>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors py-2"
              href={siteConfig.scheduleExternalHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
            >
              Schedule
            </a>
            <Link
              className="text-sm font-semibold hover:text-primary transition-colors py-2"
              href="/bio"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors py-2 border-t border-primary/10 pt-4"
              href={siteConfig.deployCta.href}
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

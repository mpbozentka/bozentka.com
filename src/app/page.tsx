import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Target,
  Code,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden noise-bg bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="layout-container flex h-full grow flex-col relative z-10">
        {/* Header */}
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
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#projects">
                Projects
              </a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#updates">
                Updates
              </a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#about">
                About
              </a>
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

        <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
          {/* Hero Section */}
          <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            </div>
            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl shrink-0 order-2 md:order-1">
                <Image
                  src="/mitchell-bozentka.png"
                  alt="Mitchell Bozentka"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 12rem, (max-width: 1024px) 16rem, 18rem"
                  priority
                />
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2 flex-1">
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium mb-4 tracking-tight text-slate-900 dark:text-slate-100">
                  Mitchell Bozentka
                </h1>
                <p className="text-base md:text-xl font-light tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 mb-10">
                  PGA Professional & Sovereign Steward
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link
                    href={siteConfig.deployCta.href}
                    className="min-w-[200px] bg-primary text-white h-14 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center"
                  >
                    Get in Touch
                  </Link>
                  <a
                    href="#projects"
                    className="min-w-[200px] border-2 border-primary/20 h-14 px-8 rounded-xl font-bold text-lg hover:bg-primary/5 transition-all flex items-center justify-center text-slate-900 dark:text-slate-100"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>
            </div>
            <a
              href="#about"
              className="mt-16 animate-bounce text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              aria-label="Scroll to about"
            >
              <ChevronDown className="size-8" />
            </a>
          </section>

          {/* Intro Section */}
          <section className="py-32 px-6 bg-white dark:bg-white/5 rounded-2xl border border-primary/10" id="about">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
                Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                Vibe coding for fellow golf professionals and independent minds.{" "}
                <span className="text-slate-500 dark:text-slate-400 italic font-serif font-normal">
                  Building your way out.
                </span>
              </h2>
            </div>
          </section>

          {/* Featured Project (Swingstr) */}
          <section className="py-32 px-6" id="projects">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div>
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Selected Work
                </h3>
                <h4 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Featured Project</h4>
              </div>
              <Link
                href={siteConfig.vercelProjectsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold flex items-center gap-2 group w-fit"
              >
                View all projects
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative group rounded-2xl overflow-hidden bg-white dark:bg-white/5 shadow-xl border border-primary/10">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto bg-slate-200 dark:bg-slate-800 overflow-hidden relative min-h-[240px]">
                  <Image
                    src={siteConfig.swingstr.imageUrl}
                    alt="Golf swing analysis software interface"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-8 md:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                      New Release
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest italic">
                      v2.4.0
                    </span>
                  </div>
                  <h5 className="text-5xl font-black mb-6 tracking-tighter text-slate-900 dark:text-slate-100">
                    {siteConfig.swingstr.name}
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                    {siteConfig.swingstr.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-10">
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                      React
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                      Node.js
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                      Computer Vision
                    </span>
                  </div>
                  <Link
                    href={siteConfig.swingstr.launchHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-fit bg-primary text-white px-8 py-4 rounded-xl font-bold hover:gap-4 transition-all"
                  >
                    View Project Detail
                    <ExternalLink className="size-5" />
                  </Link>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1.5 bg-primary w-0 group-hover:w-full transition-all duration-700" />
            </div>
          </section>

          {/* Feed / Updates Section */}
          <section className="py-32 px-6 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-primary/10" id="updates">
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                <h4 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Latest Updates</h4>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Short-form thoughts on golf technology, personal sovereignty, and
                  the future of professional sports.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <article className="bg-white dark:bg-white/5 p-8 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      June 12, 2024
                    </span>
                    <Sparkles className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <h6 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                    The Sovereign Steward Mindset
                  </h6>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Building personal infrastructure that allows for true
                    independence in a rapidly shifting professional landscape.
                  </p>
                  <Link
                    href={siteConfig.nostr.globalFeedHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 hover:text-primary transition-colors"
                  >
                    Read thread
                    <ExternalLink className="size-4" />
                  </Link>
                </article>

                <article className="bg-white dark:bg-white/5 p-8 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      May 28, 2024
                    </span>
                    <Target className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <h6 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Swing Data vs. Feel</h6>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Why the future of PGA coaching isn&apos;t just more data, but
                    better interpretation and contextualization for the player.
                  </p>
                  <Link
                    href={siteConfig.nostr.globalFeedHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 hover:text-primary transition-colors"
                  >
                    Read more
                    <ExternalLink className="size-4" />
                  </Link>
                </article>

                <article className="bg-white dark:bg-white/5 p-8 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      May 15, 2024
                    </span>
                    <Code className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <h6 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Building Swingstr v3.0</h6>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    A deep dive into the computer vision stack we&apos;re
                    utilizing to track club path metrics in real-time.
                  </p>
                  <Link
                    href={siteConfig.swingstr.launchHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 hover:text-primary transition-colors"
                  >
                    Follow dev log
                    <ExternalLink className="size-4" />
                  </Link>
                </article>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-20 border-t border-primary/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold tracking-tighter mb-2 text-slate-900 dark:text-slate-100">
                  Mitchell Bozentka
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  PGA Professional & Independent Developer
                </p>
              </div>
              <div className="flex gap-8">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em] text-xs font-bold"
                >
                  Twitter
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em] text-xs font-bold"
                >
                  LinkedIn
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em] text-xs font-bold"
                >
                  Instagram
                </a>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest">
                © {new Date().getFullYear()} MB. All Rights Reserved.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Layout,
  Sparkles,
  Target,
  Code,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-light text-ink font-sans">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 bg-ink flex items-center justify-center rounded text-white">
              <Layout className="size-5" />
            </div>
            <span className="font-bold tracking-tighter text-xl">MB.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <a
              className="hover:text-accent-blue transition-colors"
              href="#projects"
            >
              Projects
            </a>
            <a
              className="hover:text-accent-blue transition-colors"
              href="#updates"
            >
              Updates
            </a>
            <a
              className="hover:text-accent-blue transition-colors"
              href="#about"
            >
              About
            </a>
          </nav>
          <Link
            href={siteConfig.deployCta.href}
            className="bg-ink text-white px-6 py-2 rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-blue/20 via-transparent to-transparent" />
          </div>
          <h1 className="font-serif text-6xl md:text-9xl font-medium mb-6 tracking-tight">
            Mitchell Bozentka
          </h1>
          <p className="text-lg md:text-2xl font-light tracking-[0.2em] uppercase text-neutral-500 mb-12">
            PGA Professional & Sovereign Steward
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href={siteConfig.deployCta.href}
              className="min-w-[200px] bg-ink text-white h-14 px-8 rounded-lg font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              Get in Touch
            </Link>
            <a
              href="#projects"
              className="min-w-[200px] border border-ink/10 h-14 px-8 rounded-lg font-bold text-lg hover:bg-black/5 transition-all flex items-center justify-center"
            >
              View Portfolio
            </a>
          </div>
          <a
            href="#about"
            className="mt-20 animate-bounce text-neutral-400 hover:text-ink transition-colors"
            aria-label="Scroll to about"
          >
            <ChevronDown className="size-8" />
          </a>
        </section>

        {/* Intro Section */}
        <section
          className="py-32 px-6 bg-white"
          id="about"
        >
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-accent-blue font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
              Philosophy
            </span>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              Vibe coding for fellow golf professionals and independent minds.{" "}
              <span className="text-neutral-400 italic font-serif font-normal">
                Building your way out.
              </span>
            </h2>
          </div>
        </section>

        {/* Featured Project (Swingstr) */}
        <section className="py-32 px-6 max-w-7xl mx-auto" id="projects">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-500 mb-2">
                Selected Work
              </h3>
              <h4 className="text-4xl font-bold">Featured Project</h4>
            </div>
            <Link
              href={siteConfig.vercelProjectsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue font-bold flex items-center gap-2 group w-fit"
            >
              View all projects
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative group rounded-2xl overflow-hidden bg-white shadow-2xl shadow-black/5 border border-black/5">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto bg-neutral-200 overflow-hidden relative">
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
                  <span className="px-3 py-1 bg-accent-blue text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    New Release
                  </span>
                  <span className="text-neutral-400 text-xs font-medium uppercase tracking-widest italic">
                    v2.4.0
                  </span>
                </div>
                <h5 className="text-5xl font-black mb-6 tracking-tighter">
                  {siteConfig.swingstr.name}
                </h5>
                <p className="text-neutral-500 text-lg leading-relaxed mb-8">
                  {siteConfig.swingstr.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-10">
                  <span className="text-xs font-semibold px-3 py-1 bg-neutral-100 rounded">
                    React
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 bg-neutral-100 rounded">
                    Node.js
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 bg-neutral-100 rounded">
                    Computer Vision
                  </span>
                </div>
                <Link
                  href={siteConfig.swingstr.launchHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-fit bg-ink text-white px-8 py-4 rounded-lg font-bold hover:gap-4 transition-all"
                >
                  View Project Detail
                  <ExternalLink className="size-5" />
                </Link>
              </div>
            </div>
            {/* Accent border */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-accent-blue w-0 group-hover:w-full transition-all duration-700" />
          </div>
        </section>

        {/* Feed / Updates Section */}
        <section
          className="py-32 px-6 bg-neutral-100"
          id="updates"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
              <h4 className="text-4xl font-bold">Latest Updates</h4>
              <p className="text-neutral-500 max-w-md">
                Short-form thoughts on golf technology, personal sovereignty, and
                the future of professional sports.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-white p-8 rounded-xl border border-black/5 hover:border-accent-blue/30 transition-colors group">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    June 12, 2024
                  </span>
                  <Sparkles className="size-5 text-neutral-300 group-hover:text-accent-blue transition-colors" />
                </div>
                <h6 className="text-xl font-bold mb-4">
                  The Sovereign Steward Mindset
                </h6>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                  Building personal infrastructure that allows for true
                  independence in a rapidly shifting professional landscape.
                </p>
                <Link
                  href={siteConfig.nostr.globalFeedHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold flex items-center gap-2 text-ink hover:text-accent-blue transition-colors"
                >
                  Read thread
                  <ExternalLink className="size-4" />
                </Link>
              </article>

              <article className="bg-white p-8 rounded-xl border border-black/5 hover:border-accent-blue/30 transition-colors group">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    May 28, 2024
                  </span>
                  <Target className="size-5 text-neutral-300 group-hover:text-accent-blue transition-colors" />
                </div>
                <h6 className="text-xl font-bold mb-4">Swing Data vs. Feel</h6>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                  Why the future of PGA coaching isn&apos;t just more data, but
                  better interpretation and contextualization for the player.
                </p>
                <Link
                  href={siteConfig.nostr.globalFeedHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold flex items-center gap-2 text-ink hover:text-accent-blue transition-colors"
                >
                  Read more
                  <ExternalLink className="size-4" />
                </Link>
              </article>

              <article className="bg-white p-8 rounded-xl border border-black/5 hover:border-accent-blue/30 transition-colors group">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    May 15, 2024
                  </span>
                  <Code className="size-5 text-neutral-300 group-hover:text-accent-blue transition-colors" />
                </div>
                <h6 className="text-xl font-bold mb-4">Building Swingstr v3.0</h6>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                  A deep dive into the computer vision stack we&apos;re
                  utilizing to track club path metrics in real-time.
                </p>
                <Link
                  href={siteConfig.swingstr.launchHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold flex items-center gap-2 text-ink hover:text-accent-blue transition-colors"
                >
                  Follow dev log
                  <ExternalLink className="size-4" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 px-6 border-t border-black/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold tracking-tighter mb-2">
                Mitchell Bozentka
              </h2>
              <p className="text-neutral-500 text-sm">
                PGA Professional & Independent Developer
              </p>
            </div>
            <div className="flex gap-8">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent-blue transition-colors uppercase tracking-[0.2em] text-xs font-bold"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent-blue transition-colors uppercase tracking-[0.2em] text-xs font-bold"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent-blue transition-colors uppercase tracking-[0.2em] text-xs font-bold"
              >
                Instagram
              </a>
            </div>
            <p className="text-neutral-400 text-xs uppercase tracking-widest">
              © {new Date().getFullYear()} MB. All Rights Reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

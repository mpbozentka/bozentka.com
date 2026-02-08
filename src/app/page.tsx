import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Database,
  ExternalLink,
  Hammer,
  Music,
  Rocket,
  Shield,
  Target,
  Terminal,
} from "lucide-react";
import { BitcoinChartCard } from "@/components/bitcoin-chart-card";
import { BitcoinTickerBar } from "@/components/bitcoin-ticker-bar";
import { NostrBentoFeed } from "@/components/nostr-bento-feed";
import { siteConfig } from "@/lib/site-config";

const projectIcons = {
  book: BookOpen,
  terminal: Terminal,
  database: Database,
  shield: Shield,
  music: Music,
} as const;

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-white font-sans">
      <BitcoinTickerBar />

      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-zinc-800 px-6 md:px-20 py-5">
          <Link
            href="/"
            className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
          >
            <div className="size-6 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight uppercase font-mono">
              bozentka.com
            </h2>
          </Link>
          <div className="flex flex-1 justify-end gap-8 items-center">
            <nav className="hidden md:flex items-center gap-8">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-zinc-400 hover:text-primary text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href={siteConfig.deployCta.href}
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-background-dark text-sm font-bold tracking-wide hover:opacity-90 transition-all"
            >
              {siteConfig.deployCta.label}
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-[1200px] mx-auto w-full p-6 md:p-12 lg:p-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Hero Bento */}
            <div className="md:col-span-8 bento-card rounded-xl p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
              <div className="absolute top-8 right-8 text-right text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em] pointer-events-none space-y-1">
                <div>bozentka.com</div>
                <div className="text-zinc-600 normal-case tracking-normal">Est. Block Height #935,517</div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="pulse-beacon" />
                  <span className="text-primary text-xs font-mono uppercase tracking-[0.2em]">
                    Open for Work
                  </span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl mb-4 leading-tight italic">
                  Mitchell Bozentka
                </h1>
                <div className="space-y-4">
                  <h3 className="text-white text-xl md:text-2xl font-mono uppercase tracking-wider">
                    PGA Professional & Sovereign Steward
                  </h3>
                  <p className="text-zinc-400 text-lg md:text-xl font-light tracking-wide max-w-xl">
                    Vibe coding for fellow golf professionals and independent
                    minds.
                  </p>
                  <p className="text-primary text-sm md:text-base font-mono mt-2 tracking-wide">
                    Build your way out
                  </p>
                </div>
              </div>
            </div>

            {/* Swingstr Card */}
            <Link
              href={siteConfig.swingstr.launchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="md:col-span-4 bento-card rounded-xl p-8 flex flex-col min-h-[400px] group overflow-hidden relative"
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Image
                  src={siteConfig.swingstr.imageUrl}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="400px"
                  unoptimized
                />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                  <span className="bg-primary text-background-dark px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Beta
                  </span>
                  <Target className="text-zinc-500" size={24} />
                </div>
                <div className="mt-20">
                  <h2 className="font-serif text-3xl mb-2 italic">
                    {siteConfig.swingstr.name}
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-sans">
                    {siteConfig.swingstr.description}
                  </p>
                  <span className="w-full py-3 bg-white/10 group-hover:bg-primary group-hover:text-background-dark transition-all rounded-lg text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5">
                    Launch
                    <Rocket className="text-base" size={18} />
                  </span>
                </div>
              </div>
            </Link>

            {/* Select Projects */}
            <div className="md:col-span-7 bento-card rounded-xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl italic">Select Projects</h2>
                <span className="text-zinc-600 text-[10px] font-mono tracking-widest uppercase">
                  Github Repositories
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {siteConfig.projects.map((project) => {
                  const Icon = projectIcons[project.icon];
                  return (
                    <div
                      key={project.id}
                      className="group/item flex items-start justify-between p-5 rounded-lg border border-zinc-800/50 bg-zinc-900/20 hover:border-primary/40 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="text-zinc-500 text-lg" size={18} />
                          <h4 className="font-mono text-sm font-bold text-white group-hover/item:text-primary transition-colors">
                            {project.name}
                          </h4>
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed max-w-md">
                          {project.description}
                        </p>
                      </div>
                      {"comingSoon" in project && project.comingSoon ? (
                        <span className="ml-4 p-2 bg-zinc-800 rounded flex items-center gap-2 text-zinc-500">
                          <Hammer className="text-base" size={18} />
                        </span>
                      ) : (
                        <a
                          href={project.launchHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 p-2 bg-zinc-800 hover:bg-primary hover:text-background-dark rounded transition-all flex items-center gap-2"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-tighter hidden md:inline">
                            Launch
                          </span>
                          <ExternalLink className="text-base" size={18} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BTC Chart */}
            <BitcoinChartCard />

            {/* The Stack */}
            <div className="md:col-span-6 bento-card rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] mb-4 block">
                  The Stack
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <ul className="space-y-4 font-mono">
                    <li className="flex items-center gap-3 text-sm">
                      <span className="size-1 bg-primary rounded-full" />
                      Bitcoin Core
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="size-1 bg-primary rounded-full" />
                      The 12 Steps
                    </li>
                  </ul>
                  <ul className="space-y-4 font-mono">
                    <li className="flex items-center gap-3 text-sm">
                      <span className="size-1 bg-primary rounded-full" />
                      Cursor AI
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="size-1 bg-primary rounded-full" />
                      Vercel
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Nostr Feed */}
            <NostrBentoFeed />
          </div>
        </main>

        <footer className="px-6 md:px-20 py-10 flex flex-col md:flex-row justify-between items-center border-t border-zinc-900 gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-zinc-500 text-xs font-mono">
              © {new Date().getFullYear()} MITCHELL BOZENTKA. ALL RIGHTS
              RESERVED.
            </p>
            <span className="hidden md:block text-zinc-800 text-xs font-mono">
              —
            </span>
            <span className="text-zinc-700 text-[10px] font-mono tracking-widest uppercase">
              bozentka.com
            </span>
          </div>
          <div className="flex gap-8 text-zinc-500 text-xs font-mono">
            <Link
              href={siteConfig.footer.privacyHref}
              className="hover:text-white transition-colors"
            >
              PRIVACY
            </Link>
            <Link
              href={siteConfig.footer.legalHref}
              className="hover:text-white transition-colors"
            >
              LEGAL
            </Link>
            <Link
              href={siteConfig.footer.nodeStatusHref}
              className="text-primary italic hover:opacity-80 transition-opacity"
            >
              NODE: RUNNING
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

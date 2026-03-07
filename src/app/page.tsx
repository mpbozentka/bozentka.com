import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Database,
  ExternalLink,
  Hammer,
  Music,
  Shield,
  Terminal,
  TrendingUp,
} from "lucide-react";
import { BitcoinChartCard } from "@/components/bitcoin-chart-card";
import { NostrBentoFeed } from "@/components/nostr-bento-feed";
import { siteConfig } from "@/lib/site-config";

const projectIcons = {
  book: BookOpen,
  terminal: Terminal,
  database: Database,
  shield: Shield,
  music: Music,
  trending: TrendingUp,
} as const;

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground font-sans">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-stone px-6 md:px-20 py-5">
          <div className="flex flex-1 justify-end gap-8 items-center">
            <nav className="hidden md:flex items-center gap-8">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-stone hover:text-primary text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-[1200px] mx-auto w-full p-6 md:p-12 lg:p-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Hero Bento */}
            <div className="md:col-span-12 bento-card rounded-xl p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
              <div className="absolute top-8 right-8 text-right text-[10px] font-mono text-stone uppercase tracking-[0.3em] pointer-events-none space-y-1">
                <div>bozentka.com</div>
                <div className="normal-case tracking-normal opacity-80">Est. Block Height #935,517</div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="pulse-beacon" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] opacity-80" style={{ color: "#D97757" }}>
                    Open for Work
                  </span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl mb-4 leading-tight italic text-foreground">
                  Mitchell Bozentka
                </h1>
                <div className="space-y-4">
                  <h3 className="text-foreground text-xl md:text-2xl font-mono uppercase tracking-wider">
                    PGA Professional & Sovereign Steward
                  </h3>
                  <p className="text-foreground/70 text-lg md:text-xl font-light tracking-wide max-w-xl">
                    Vibe coding for fellow golf professionals and independent
                    minds.
                  </p>
                  <p className="text-sm md:text-base font-mono mt-2 tracking-wide" style={{ color: "#D97757" }}>
                    Build your way out
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  href={siteConfig.scheduleHref}
                  className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 text-sm font-bold tracking-wide hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#D97757", color: "#FAF9F5" }}
                >
                  Schedule
                </Link>
                <Link
                  href={siteConfig.deployCta.href}
                  className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 text-sm font-bold tracking-wide hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#D97757", color: "#FAF9F5" }}
                >
                  {siteConfig.deployCta.label}
                </Link>
              </div>
            </div>

            {/* Select Projects */}
            <div className="md:col-span-7">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-3xl italic">Select Projects</h2>
                <a
                  href={siteConfig.vercelProjectsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone hover:text-primary text-[10px] font-mono tracking-widest uppercase transition-colors"
                >
                  View on Vercel
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Swingstr */}
                <div className="bento-card rounded-xl overflow-hidden flex flex-col hover:border-primary/40 transition-all">
                  <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-stone/20 border-b border-stone/40">
                    <Image
                      src={siteConfig.swingstr.imageUrl}
                      alt={`${siteConfig.swingstr.name} screenshot`}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono text-sm font-bold text-foreground">
                        {siteConfig.swingstr.name}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full" style={{ backgroundColor: "#D97757", color: "#FAF9F5" }}>
                        Beta
                      </span>
                    </div>
                    <p className="text-foreground/70 text-xs leading-relaxed flex-1">
                      {siteConfig.swingstr.description}
                    </p>
                    <a
                      href={siteConfig.swingstr.launchHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 p-2 bg-stone/30 hover:bg-primary hover:text-primary-foreground rounded text-sm font-medium w-fit transition-all"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Launch</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
                {siteConfig.projects.map((project) => {
                  const Icon = projectIcons[project.icon];
                  const screenshotUrl = "screenshotUrl" in project ? project.screenshotUrl : "";
                  return (
                    <div
                      key={project.id}
                      className="bento-card rounded-xl overflow-hidden flex flex-col hover:border-primary/40 transition-all"
                    >
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-stone/20 border-b border-stone/40">
                        {screenshotUrl ? (
                          <Image
                            src={screenshotUrl}
                            alt={`${project.name} screenshot`}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover"
                            unoptimized={screenshotUrl.startsWith("http")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center min-h-[140px]">
                            <Icon className="text-stone" size={40} />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="font-mono text-sm font-bold text-foreground mb-2">
                          {project.name}
                        </h4>
                        <p className="text-foreground/70 text-xs leading-relaxed flex-1">
                          {project.description}
                        </p>
                        {"comingSoon" in project && project.comingSoon ? (
                          <span className="mt-4 inline-flex items-center justify-center gap-2 p-2 bg-stone/30 rounded text-stone w-fit">
                            <Hammer size={16} />
                            <span className="text-[10px] font-mono uppercase">Coming soon</span>
                          </span>
                        ) : (
                          <a
                            href={project.launchHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center justify-center gap-2 p-2 bg-stone/30 hover:bg-primary hover:text-primary-foreground rounded text-sm font-medium w-fit transition-all"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Launch</span>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BTC Chart */}
            <BitcoinChartCard />

            {/* Nostr Feed */}
            <div className="md:col-span-6 min-w-0">
              <NostrBentoFeed />
            </div>
          </div>
        </main>

        <footer className="px-6 md:px-20 py-10 flex flex-col md:flex-row justify-between items-center border-t border-stone gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-foreground/70 text-xs font-mono">
              © {new Date().getFullYear()} MITCHELL BOZENTKA. ALL RIGHTS
              RESERVED.
            </p>
            <span className="hidden md:block text-foreground text-xs font-mono">
              —
            </span>
            <span className="text-foreground/70 text-[10px] font-mono tracking-widest uppercase">
              bozentka.com
            </span>
          </div>
          <div className="flex gap-8 text-foreground/70 text-xs font-mono">
            <Link
              href={siteConfig.footer.privacyHref}
              className="hover:text-foreground transition-colors"
            >
              PRIVACY
            </Link>
            <Link
              href={siteConfig.footer.legalHref}
              className="hover:text-foreground transition-colors"
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

import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LiveTicker } from "@/components/live-ticker";
import { NostrNotesFeed } from "@/components/nostr-notes-feed";
import { ProjectCard } from "@/components/project-card";

export default function Home() {
  return (
    <div className="relative min-h-screen gradient-bg noise-bg">
      <div className="relative z-10">
        <LiveTicker />
        <Hero />

        <section
          id="projects"
          className="mx-auto max-w-6xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-10 text-2xl font-semibold text-white md:text-3xl">
            Micro-SaaS
          </h2>
          <div className="grid auto-rows-[minmax(200px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ProjectCard
              title="Swingstr"
              description="Import your golf swing video right from your camera roll and analyze it in slow-motion."
              badge="Beta"
              badgeVariant="beta"
              icon="video"
              launchUrl="https://swingstr.vercel.app"
              featured
            />
            <ProjectCard
              title="Longhorn Ledger"
              description="Track your strokes gained stats and improve your game."
              badge="Beta"
              badgeVariant="beta"
              icon="dollar"
              launchUrl="https://longhorn-ledger-six.vercel.app"
            />
            <ProjectCard
              title="Bitcoin Sandbox"
              description="Educational tools for running a node and understanding the mempool."
              badge="Building"
              badgeVariant="building"
              icon="bitcoin"
              pricing="Free"
              launchUrl={null}
            />
            <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1 lg:row-span-2">
              <article className="group flex-1 rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] hover:border-slate-700/50 hover:bg-slate-800/50">
                <h3 className="text-lg font-semibold text-white">About Me</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  I am a PGA Professional turned Software Engineer based in
                  Austin, TX. I build what I use.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="nostr-notes"
          className="mx-auto max-w-6xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
            Nostr Notes
          </h2>
          <p className="mb-10 max-w-2xl text-slate-400">
            Live feed of my Nostr posts. Follow me there for updates and thoughts.
          </p>
          <NostrNotesFeed maxHeight="420px" />
        </section>

        <Footer />
      </div>
    </div>
  );
}

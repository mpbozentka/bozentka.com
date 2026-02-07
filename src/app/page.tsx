import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LiveTicker } from "@/components/live-ticker";
import { ProjectCard } from "@/components/project-card";

const labNotes = [
  {
    title: "Why I switched to Vibe Coding",
    slug: "vibe-coding",
    date: "Feb 1, 2026",
    excerpt: "Rethinking how I approach building software.",
  },
  {
    title: "The future of Golf Tech",
    slug: "golf-tech-future",
    date: "Jan 28, 2026",
    excerpt: "Where AI and the greens are heading.",
  },
  {
    title: "Running a Bitcoin node on a Raspberry Pi",
    slug: "bitcoin-node-pi",
    date: "Jan 15, 2026",
    excerpt: "Getting started with self-custody and validation.",
  },
  {
    title: "From PGA to Product",
    slug: "pga-to-product",
    date: "Jan 5, 2026",
    excerpt: "How the fairway led me to the keyboard.",
  },
];

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
              description="AI-powered golf swing analysis. Upload video, get instant PGA-level feedback."
              badge="Live"
              badgeVariant="live"
              icon="video"
              pricing="$29/mo"
              launchUrl="https://swingstr.vercel.app"
              featured
            />
            <ProjectCard
              title="Longhorn Ledger"
              description="Track your strokes gained stats and improve your game."
              badge="Beta"
              badgeVariant="beta"
              icon="dollar"
              pricing="Free"
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
          id="lab-notes"
          className="mx-auto max-w-6xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
            Lab Notes
          </h2>
          <p className="mb-10 max-w-2xl text-slate-400">
            Updates on what I&apos;m building, lessons learned, and thoughts from
            the intersection of golf and software.
          </p>
          <div className="space-y-6">
            {labNotes.map((note) => (
              <a
                key={note.slug}
                href={`/notes/${note.slug}`}
                className="block rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm transition-colors hover:border-slate-700/50 hover:bg-slate-800/50"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-semibold text-white">{note.title}</h3>
                  <span className="text-sm text-slate-500">{note.date}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{note.excerpt}</p>
              </a>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

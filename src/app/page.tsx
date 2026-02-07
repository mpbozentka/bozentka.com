import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";

const labNotes = [
  { title: "Why I switched to Vibe Coding", slug: "vibe-coding" },
  { title: "The future of Golf Tech", slug: "golf-tech-future" },
  { title: "Running a Bitcoin node on a Raspberry Pi", slug: "bitcoin-node-pi" },
  { title: "From PGA to Product", slug: "pga-to-product" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen gradient-bg noise-bg">
      <div className="relative z-10">
        <Hero />

        <section
          id="projects"
          className="mx-auto max-w-6xl px-6 py-16 md:py-24"
        >
          <h2 className="mb-10 text-2xl font-semibold text-white md:text-3xl">
            Projects
          </h2>
          <div className="grid auto-rows-[minmax(180px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ProjectCard
              title="Swingstr"
              description="AI-powered golf swing analysis. Upload video, get instant PGA-level feedback."
              badge="Live"
              badgeVariant="live"
              icon="video"
              featured
            />
            <ProjectCard
              title="Zombie Sub Slayer"
              description="Financial hygiene tool to detect and kill unwanted recurring subscriptions."
              badge="Beta"
              badgeVariant="beta"
              icon="dollar"
            />
            <ProjectCard
              title="Bitcoin Sandbox"
              description="Educational tools for running a node and understanding the mempool."
              badge="Building"
              badgeVariant="building"
              icon="bitcoin"
            />
            <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1 lg:row-span-2">
              <article className="group flex-1 rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] hover:border-slate-700/50 hover:bg-slate-800/50">
                <h3 className="text-lg font-semibold text-white">About Me</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  I am a PGA Professional turned Software Engineer based in
                  Austin, TX. I build what I use.
                </p>
              </article>
              <div className="flex-1 rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Lab Notes
                </h3>
                <ul className="space-y-3">
                  {labNotes.map((note) => (
                    <li key={note.slug}>
                      <a
                        href={`/notes/${note.slug}`}
                        className="block text-sm text-slate-400 transition-colors hover:text-emerald-400"
                      >
                        {note.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

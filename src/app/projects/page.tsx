import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Projects | Mitchell Bozentka",
  description:
    "Software projects by Mitchell Bozentka — golf tools, Bitcoin utilities, and more.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
              Projects
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Tools for golf professionals, Bitcoin users, and independent builders.
            </p>
          </div>
          <a
            href={siteConfig.githubReposHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-primary transition-colors w-fit"
          >
            GitHub Repositories
          </a>
        </div>

        {/* Featured: Swingstr */}
        <section className="mb-16">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            Featured
          </span>
          <div className="relative group rounded-2xl overflow-hidden bg-white dark:bg-white/5 shadow-xl border border-primary/10">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto bg-slate-200 dark:bg-slate-800 overflow-hidden relative min-h-[240px]">
                <Image
                  src={siteConfig.swingstr.imageUrl}
                  alt="Swingstr — golf swing analysis software"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    New Release
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest italic">
                    v2.4.0
                  </span>
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter">
                  {siteConfig.swingstr.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                  {siteConfig.swingstr.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["React", "Node.js", "Computer Vision"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={siteConfig.swingstr.launchHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-fit bg-primary text-white px-8 py-4 rounded-xl font-bold hover:gap-4 transition-all"
                >
                  View Project
                  <ExternalLink className="size-5" />
                </a>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1.5 bg-primary w-0 group-hover:w-full transition-all duration-700" />
          </div>
        </section>

        {/* All projects */}
        <section>
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
            More Projects
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteConfig.projects.map((project) => {
              const screenshotUrl =
                "screenshotUrl" in project ? project.screenshotUrl : "";
              return (
                <article
                  key={project.id}
                  className="group rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 hover:border-primary/30 transition-colors flex flex-col"
                >
                  <div className="relative w-full aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    {screenshotUrl ? (
                      <Image
                        src={screenshotUrl}
                        alt={`${project.name} screenshot`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={screenshotUrl.startsWith("http")}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700" />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                      {project.description}
                    </p>
                    <a
                      href={project.launchHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-5 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-primary transition-colors w-fit"
                    >
                      Launch
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

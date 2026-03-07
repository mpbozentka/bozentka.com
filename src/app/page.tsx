import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden noise-bg bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <SiteHeader />

        <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
          {/* Hero Section */}
          <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            </div>
            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-1 flex-1">
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium mb-4 tracking-tight text-slate-900 dark:text-slate-100">
                  Mitchell Bozentka
                </h1>
                <p className="text-base md:text-xl font-light tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 mb-10">
                  PGA Golf Professional & Independent Developer
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link
                    href={siteConfig.deployCta.href}
                    className="min-w-[200px] bg-primary text-white h-14 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center"
                  >
                    Get in Touch
                  </Link>
                  <a
                    href={siteConfig.scheduleExternalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[200px] border-2 border-primary/20 h-14 px-8 rounded-xl font-bold text-lg hover:bg-primary/5 transition-all flex items-center justify-center text-slate-900 dark:text-slate-100"
                  >
                    Schedule
                  </a>
                </div>
              </div>
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl shrink-0 order-2 md:order-2">
                <Image
                  src="/mitchell-bozentka.png"
                  alt="Mitchell Bozentka"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 12rem, (max-width: 1024px) 16rem, 18rem"
                  priority
                />
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
                    className="object-contain"
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

          {/* Named writings → Blog */}
          <section className="py-20 px-6" id="writings">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
                Named writings
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 mb-8">
                Essays, notes, and longer-form thoughts.
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 min-w-[200px] bg-primary text-white h-14 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Read the blog
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </section>

          {/* Select Projects */}
          <section className="py-20" id="select-projects">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-slate-100">
                Select Projects
              </h2>
              <Link
                href={siteConfig.githubReposHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-primary transition-colors w-fit"
              >
                GitHub Repositories
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {siteConfig.projects.map((project) => {
                const screenshotUrl =
                  "screenshotUrl" in project ? project.screenshotUrl : "";
                return (
                  <article
                    key={project.id}
                    className="group rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-primary/30 transition-colors flex flex-col md:flex-row"
                  >
                    <div className="relative w-full md:w-2/5 aspect-video md:aspect-square bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                      {screenshotUrl ? (
                        <Image
                          src={screenshotUrl}
                          alt={`${project.name} screenshot`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 40vw"
                          unoptimized={screenshotUrl.startsWith("http")}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700" />
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-center">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {project.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>
                      <Link
                        href={project.launchHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-5 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-primary transition-colors w-fit"
                      >
                        Launch
                        <ExternalLink className="size-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
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
                  PGA Golf Professional & Independent Developer
                </p>
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

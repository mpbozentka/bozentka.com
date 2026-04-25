import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden noise-bg bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <SiteHeader />

        <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
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
                  PGA Golf Professional
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <a
                    href={siteConfig.deployCta.href}
                    className="min-w-[200px] bg-primary text-white h-14 px-8 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center"
                  >
                    Get in Touch
                  </a>
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
          </section>
        </main>
      </div>
    </div>
  );
}

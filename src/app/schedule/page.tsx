import { siteConfig } from "@/lib/site-config";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Schedule | Mitchell Bozentka",
  description: "Book a time with Mitchell Bozentka.",
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto w-full px-6 py-12 md:py-16">
        <div className="rounded-2xl overflow-hidden border border-primary/10 bg-white dark:bg-white/5 shadow-xl">
          <iframe
            src={siteConfig.scheduleEmbedSrc}
            title="Schedule an appointment"
            className="w-full min-h-[600px] border-0"
            width="100%"
            height={600}
          />
        </div>
        <p className="mt-4 text-center">
          <a
            href={siteConfig.scheduleExternalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 hover:text-primary text-xs font-medium uppercase tracking-wider transition-colors"
          >
            Open in new tab
          </a>
        </p>
      </main>
      <Footer />
    </div>
  );
}

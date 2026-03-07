import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Schedule | Mitchell Bozentka",
  description: "Book a time with Mitchell Bozentka.",
};

export default function SchedulePage() {
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
            <Link
              href={siteConfig.scheduleHref}
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-primary-foreground text-sm font-bold tracking-wide hover:opacity-90 transition-all"
            >
              Schedule
            </Link>
            <Link
              href={siteConfig.deployCta.href}
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-primary-foreground text-sm font-bold tracking-wide hover:opacity-90 transition-all"
            >
              {siteConfig.deployCta.label}
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-[1200px] mx-auto w-full p-6 md:p-12 lg:p-20">
          <div className="bento-card rounded-xl overflow-hidden">
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
              className="text-foreground/70 hover:text-primary text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Open in new tab
            </a>
          </p>
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

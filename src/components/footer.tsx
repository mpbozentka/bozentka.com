import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="px-6 md:px-20 py-10 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 dark:border-slate-800 gap-6 text-slate-500 dark:text-slate-400">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <p className="text-xs font-medium">
          © {new Date().getFullYear()} MITCHELL BOZENTKA. ALL RIGHTS RESERVED.
        </p>
        <span className="hidden md:block text-slate-400 dark:text-slate-500 text-xs">
          —
        </span>
        <span className="text-[10px] font-medium tracking-widest uppercase">
          bozentka.com
        </span>
      </div>
      <div className="flex gap-8 text-xs font-medium">
        <Link
          href={siteConfig.footer.privacyHref}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          PRIVACY
        </Link>
        <Link
          href={siteConfig.footer.legalHref}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
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
  );
}

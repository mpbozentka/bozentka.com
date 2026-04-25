import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden noise-bg bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="layout-container flex h-full grow flex-col relative z-10">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1200px] px-6 py-12" />
      </div>
    </div>
  );
}

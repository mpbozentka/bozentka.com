import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Node Status | Mitchell Bozentka",
  description: "Bitcoin node status and network information.",
};

export default function NodePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen font-sans p-8 md:p-20">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="text-primary hover:opacity-80 text-sm font-mono mb-8 inline-block"
          >
            ← Back
          </Link>
          <h1 className="font-serif text-4xl italic mb-6">Node Status</h1>
          <div className="space-y-4 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="relative flex size-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-3 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                Bitcoin Node: Running
              </span>
            </div>
            <p className="text-sm">
              A full Bitcoin node is running in support of the network.
              Detailed node statistics and block explorer integration coming
              soon.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Terms of Use | Mitchell Bozentka",
  description: "Terms of use for bozentka.com.",
};

export default function LegalPage() {
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
          <h1 className="font-serif text-4xl italic mb-6">Terms of Use</h1>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800 dark:text-slate-200">Last updated:</strong>{" "}
              March 2026
            </p>
            <p>
              All content on bozentka.com — including text, graphics, code
              samples, and project descriptions — is the intellectual property
              of Mitchell Bozentka unless otherwise stated.
            </p>
            <p>
              The software tools linked from this site (Swingstr, Longhorn
              Ledger, Mempool.radio, Unspent) are provided as-is without
              warranty. Use them at your own discretion.
            </p>
            <p>
              For licensing inquiries or permissions, contact{" "}
              <a
                href="mailto:mitchell.bozentka@pga.com"
                className="text-primary hover:opacity-80"
              >
                mitchell.bozentka@pga.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

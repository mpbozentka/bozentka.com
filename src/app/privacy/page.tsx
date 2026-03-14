import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Privacy Policy | Mitchell Bozentka",
  description: "Privacy policy for bozentka.com.",
};

export default function PrivacyPage() {
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
          <h1 className="font-serif text-4xl italic mb-6">Privacy Policy</h1>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800 dark:text-slate-200">Last updated:</strong>{" "}
              March 2026
            </p>
            <p>
              bozentka.com does not collect personal information beyond what is
              voluntarily provided through the newsletter signup (powered by
              Beehiiv) or the contact email. No cookies are used for tracking
              purposes.
            </p>
            <p>
              Third-party embeds (Google Calendar, Beehiiv) may set their own
              cookies — please refer to their respective privacy policies for
              details.
            </p>
            <p>
              If you have any questions, reach out at{" "}
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

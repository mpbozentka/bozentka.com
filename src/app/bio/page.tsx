import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "About | Mitchell Bozentka",
  description:
    "PGA Golf Professional and independent developer building custom software for golf professionals.",
};

export default function BioPage() {
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
          <h1 className="font-serif text-4xl italic mb-6">About</h1>
          <div className="space-y-5 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              Mitchell Bozentka is a PGA Golf Professional and independent
              developer. He graduated from Campbell University in 2018 with a
              Bachelor&apos;s Degree in Business Administration and earned his
              PGA credentials shortly after.
            </p>
            <p>
              While at Campbell, he completed internships at Lyman Orchards Golf
              Club (Middlefield, CT), Vail Golf Club (Vail, CO), Rock Hill
              Country Club (Manorville, NY), and Pinehurst Resort (Pinehurst,
              NC), building a foundation across some of the most respected
              operations in the game.
            </p>
            <p>
              Teaching has been central to Mitchell&apos;s life in golf since
              the very beginning. He started giving lessons at 12 years old,
              working for free lunch and tee times. Along the way, he&apos;s
              been mentored by three Golf Digest Top 50 instructors and Golf
              Magazine Top 100 Club Fitters, experiences that shaped his
              approach to coaching and fitting.
            </p>
            <p>
              Today, Mitchell splits his time between the lesson tee and the
              command line. He builds custom software tools for golf
              professionals and independent-minded builders, people who want to
              own their data, their workflows, and their craft.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";

export default function BioPage() {
  return (
    <div className="min-h-screen bg-background-dark text-white font-sans p-8 md:p-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-primary hover:opacity-80 text-sm font-mono mb-8 inline-block"
        >
          ← Back
        </Link>
        <h1 className="font-serif text-4xl italic mb-6">Full Bio</h1>
        <div className="text-zinc-400 space-y-4">
          <p>
            PGA Professional & Sovereign Steward. Empowering independent minds
            through Personal Agency and custom software solutions.
          </p>
          <p>Add your full bio content here.</p>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background-dark text-white font-sans p-8 md:p-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-primary hover:opacity-80 text-sm font-mono mb-8 inline-block"
        >
          ← Back
        </Link>
        <h1 className="font-serif text-4xl italic mb-4">Legal</h1>
        <p className="text-zinc-400">Add your legal terms here.</p>
      </div>
    </div>
  );
}

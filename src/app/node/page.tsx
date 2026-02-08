import Link from "next/link";

export default function NodePage() {
  return (
    <div className="min-h-screen bg-background-dark text-white font-sans p-8 md:p-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-primary hover:opacity-80 text-sm font-mono mb-8 inline-block"
        >
          ← Back
        </Link>
        <h1 className="font-serif text-4xl italic mb-4">Node Status</h1>
        <p className="text-zinc-400">
          Bitcoin node: Running. Add your node stats or explorer link here.
        </p>
      </div>
    </div>
  );
}

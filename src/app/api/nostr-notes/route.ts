import { nip19 } from "nostr-tools";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface NostrNote {
  id: string;
  content: string;
  created_at: number;
  pubkey: string;
  kind: number;
  sig: string;
  tags: string[][];
}

interface NostrWineResponse {
  data: NostrNote[];
  pagination?: { total_records: number; page: number };
}

function npubToHex(npub: string): string | null {
  try {
    const decoded = nip19.decode(npub);
    if (decoded?.type === "npub" && typeof decoded.data === "string") {
      return decoded.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  const npub = process.env.NEXT_PUBLIC_NOSTR_NPUB;
  if (!npub?.startsWith("npub1")) {
    return NextResponse.json(
      { error: "Missing or invalid NEXT_PUBLIC_NOSTR_NPUB" },
      { status: 400 }
    );
  }

  const hexPubkey = npubToHex(npub);
  if (!hexPubkey) {
    return NextResponse.json(
      { error: "Invalid npub format" },
      { status: 400 }
    );
  }

  try {
    const profileUrl = new URL("https://api.nostr.wine/search");
    profileUrl.searchParams.set("pubkey", hexPubkey);
    profileUrl.searchParams.set("kind", "0");
    profileUrl.searchParams.set("limit", "1");

    const notesUrl = new URL("https://api.nostr.wine/search");
    notesUrl.searchParams.set("pubkey", hexPubkey);
    notesUrl.searchParams.set("kind", "1");
    notesUrl.searchParams.set("limit", "30");
    notesUrl.searchParams.set("sort", "time");
    notesUrl.searchParams.set("order", "descending");

    const [profileRes, notesRes] = await Promise.all([
      fetch(profileUrl.toString(), { headers: { Accept: "application/json" }, next: { revalidate: 300 } }),
      fetch(notesUrl.toString(), { headers: { Accept: "application/json" }, next: { revalidate: 60 } }),
    ]);

    const profile: { name?: string; picture?: string; nip05?: string } = {};
    if (profileRes.ok) {
      const profileJson = await profileRes.json();
      const raw = Array.isArray(profileJson?.data) && profileJson.data[0]?.content;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          if (typeof parsed.name === "string") profile.name = parsed.name;
          if (typeof parsed.picture === "string") profile.picture = parsed.picture;
          if (typeof parsed.nip05 === "string") profile.nip05 = parsed.nip05;
        } catch {
          /* ignore */
        }
      }
    }

    if (!notesRes.ok) {
      const text = await notesRes.text();
      return NextResponse.json(
        { error: "Failed to fetch notes", details: text.slice(0, 200) },
        { status: 502 }
      );
    }

    const json: NostrWineResponse = await notesRes.json();
    const notes = Array.isArray(json?.data) ? json.data : [];

    const replyToPubkeys = new Set<string>();
    for (const n of notes) {
      const pTag = n.tags?.find((t) => t[0] === "p" && t[1]);
      if (pTag?.[1]) replyToPubkeys.add(pTag[1]);
    }
    const replyPubkeyList = Array.from(replyToPubkeys).slice(0, 15);
    const profilesMap: Record<string, { name?: string; picture?: string }> = {};
    await Promise.all(
      replyPubkeyList.map(async (hex) => {
        try {
          const r = await fetch(
            `https://api.nostr.wine/search?pubkey=${hex}&kind=0&limit=1`,
            { headers: { Accept: "application/json" }, next: { revalidate: 300 } }
          );
          if (!r.ok) return;
          const data = await r.json();
          const raw = Array.isArray(data?.data) && data.data[0]?.content;
          if (!raw) return;
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          profilesMap[hex] = {
            name: typeof parsed.name === "string" ? parsed.name : undefined,
            picture: typeof parsed.picture === "string" ? parsed.picture : undefined,
          };
        } catch {
          /* ignore */
        }
      })
    );

    return NextResponse.json({
      npub,
      profile,
      profiles: profilesMap,
      notes: notes.map((n) => {
        const pTag = n.tags?.find((t) => t[0] === "p" && t[1]);
        return {
          id: n.id,
          content: n.content,
          created_at: n.created_at,
          pubkey: n.pubkey,
          tags: n.tags || [],
          reply_to_pubkey: pTag?.[1] || null,
        };
      }),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch notes", details: message },
      { status: 500 }
    );
  }
}

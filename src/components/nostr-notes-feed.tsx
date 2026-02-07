"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ExternalLink, User } from "lucide-react";

interface NostrProfile {
  name?: string;
  picture?: string;
  nip05?: string;
}

interface NostrNote {
  id: string;
  content: string;
  created_at: number;
  pubkey: string;
  reply_to_pubkey: string | null;
}

interface NostrNotesFeedProps {
  maxHeight?: string;
}

const IMAGE_URL_REGEX = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)(\?[^\s]*)?/gi;
const NOSTR_IMAGE_REGEX = /https?:\/\/(nostr\.build|cdn\.nostr\.build|imgur\.com\/[^\s]+|i\.nostr\.build)[^\s]*/gi;

function extractImageUrls(content: string): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  const add = (raw: string) => {
    const u = raw.trim().replace(/[)\]>]+$/, "");
    if (u && !seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  };
  let m: RegExpExecArray | null;
  const re1 = new RegExp(IMAGE_URL_REGEX.source, "gi");
  while ((m = re1.exec(content)) !== null) add(m[0]);
  const re2 = new RegExp(NOSTR_IMAGE_REGEX.source, "gi");
  while ((m = re2.exec(content)) !== null) add(m[0]);
  return urls;
}

function contentWithoutImageUrls(content: string): string {
  return content
    .replace(IMAGE_URL_REGEX, "")
    .replace(NOSTR_IMAGE_REGEX, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatDate(ts: number): string {
  const d = new Date(ts * 1000);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkify(content: string): string {
  const escaped = escapeHtml(content);
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return escaped
    .split(urlRegex)
    .map((part) => {
      if (part.match(/^https?:\/\//)) {
        return `<a href="${escapeHtml(part)}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:underline break-all">${escapeHtml(part)}</a>`;
      }
      return part.replace(/\n/g, "<br />");
    })
    .join("");
}

export function NostrNotesFeed({ maxHeight = "420px" }: NostrNotesFeedProps) {
  const [npub, setNpub] = useState<string | null>(null);
  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const [profiles, setProfiles] = useState<Record<string, { name?: string; picture?: string }>>({});
  const [notes, setNotes] = useState<NostrNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/nostr-notes")
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(d?.error || res.statusText));
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          if (typeof data?.npub === "string") setNpub(data.npub);
          if (data?.profile && typeof data.profile === "object") setProfile(data.profile);
          if (data?.profiles && typeof data.profiles === "object") setProfiles(data.profiles);
          if (Array.isArray(data?.notes)) setNotes(data.notes);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(typeof err === "string" ? err : "Could not load notes");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-800/50 bg-slate-900/50 px-6 py-12" style={{ minHeight: maxHeight }}>
        <div className="flex gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:0ms]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 px-6 py-12 text-center">
        <p className="text-slate-400">{error}</p>
        <p className="mt-2 text-sm text-slate-500">
          Add your Nostr public key (npub) as <code className="rounded bg-slate-800 px-1">NEXT_PUBLIC_NOSTR_NPUB</code> in .env.local
        </p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 px-6 py-12 text-center">
        <p className="text-slate-400">No notes yet.</p>
      </div>
    );
  }

  const displayName = profile?.name || "Nostr";
  const picture = profile?.picture;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/50">
      <div className="flex items-center gap-4 border-b border-slate-800/50 px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 ring-2 ring-slate-700">
          {picture ? (
            <Image src={picture} alt="" width={40} height={40} className="h-full w-full object-cover" unoptimized />
          ) : (
            <User className="h-5 w-5 text-slate-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{displayName}</p>
          {profile?.nip05 && <p className="truncate text-xs text-slate-500">{profile.nip05}</p>}
        </div>
        {npub && (
          <a
            href={`https://njump.me/${npub}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-600/50 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View profile
          </a>
        )}
      </div>

      <div className="overflow-y-auto pr-1 -mr-1" style={{ maxHeight }}>
        {notes.map((note) => {
          const textOnly = contentWithoutImageUrls(note.content);
          const imageUrls = extractImageUrls(note.content);
          const replyTo = note.reply_to_pubkey ? profiles[note.reply_to_pubkey] : null;
          const replyName = replyTo?.name || (note.reply_to_pubkey ? `${note.reply_to_pubkey.slice(0, 8)}…` : null);

          return (
            <article
              key={note.id}
              className="flex gap-3 border-b border-slate-800/30 px-4 py-3 last:border-b-0 transition-colors hover:bg-slate-800/20"
            >
              <a href={`https://njump.me/${note.id}`} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
                  {picture ? (
                    <Image src={picture} alt="" width={36} height={36} className="h-full w-full object-cover" unoptimized />
                  ) : (
                    <User className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </a>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-white">{displayName}</span>
                  <a
                    href={`https://njump.me/${note.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-emerald-400"
                  >
                    {formatDate(note.created_at)}
                  </a>
                </div>
                {replyName && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    Replying to{" "}
                    <a
                      href={note.reply_to_pubkey ? `https://njump.me/p/${note.reply_to_pubkey}` : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      @{replyName}
                    </a>
                  </p>
                )}
                {textOnly ? (
                  <div
                    className="mt-1 text-sm text-slate-300 leading-relaxed break-words [&_a]:text-emerald-400 [&_a]:hover:underline"
                    dangerouslySetInnerHTML={{ __html: linkify(textOnly) }}
                  />
                ) : null}
                {imageUrls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {imageUrls.slice(0, 4).map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-lg border border-slate-700/50"
                      >
                        <Image
                          src={url}
                          alt=""
                          width={200}
                          height={128}
                          className="h-32 w-auto max-w-[200px] object-cover"
                          unoptimized
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

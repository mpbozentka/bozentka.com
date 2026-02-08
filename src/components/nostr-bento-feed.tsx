"use client";

import Image from "next/image";
import { nip19 } from "nostr-tools";
import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

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

function formatRelativeTime(ts: number): string {
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
  return d.toLocaleDateString();
}

export function NostrBentoFeed() {
  const [notes, setNotes] = useState<NostrNote[]>([]);
  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const [npub, setNpub] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/nostr-notes")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          if (Array.isArray(data?.notes)) setNotes(data.notes);
          if (data?.profile && typeof data.profile === "object") setProfile(data.profile);
          if (typeof data?.npub === "string") setNpub(data.npub);
          setError(data?.error ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load notes");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayNotes = notes.slice(0, 15);
  const displayName = profile?.name || "Anonymous";
  const displayNip05 = profile?.nip05 || (npub ? `${npub.slice(0, 12)}...` : null);

  return (
    <div className="bento-card rounded-xl p-8 flex flex-col h-[560px]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em]">
          Nostr Feed
        </span>
        <Activity className="text-sm text-zinc-500" size={18} />
      </div>

      <div className="flex-1 overflow-y-auto nostr-scroll space-y-4 pr-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex gap-1.5">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
            </div>
          </div>
        ) : error ? (
          <p className="text-zinc-500 text-xs py-4">{error}</p>
        ) : displayNotes.length === 0 ? (
          <p className="text-zinc-500 text-xs py-4">No notes yet.</p>
        ) : (
          displayNotes.map((note) => {
            const imageUrls = extractImageUrls(note.content);
            const textContent = contentWithoutImageUrls(note.content);
            try {
              const noteId = nip19.noteEncode(note.id);
              return (
                <a
                  key={note.id}
                  href={`https://njump.me/${noteId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/80 transition-colors overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 size-10 rounded-full ring-2 ring-primary/40 overflow-hidden bg-zinc-800">
                        {profile?.picture ? (
                          <Image
                            src={profile.picture}
                            alt=""
                            width={40}
                            height={40}
                            className="size-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="size-full bg-zinc-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">
                            {displayName}
                          </span>
                          {displayNip05 && (
                            <span className="text-zinc-500 text-xs">
                              {displayNip05}
                            </span>
                          )}
                          <span className="text-zinc-600 text-xs">·</span>
                          <span className="text-zinc-600 text-xs">
                            {formatRelativeTime(note.created_at)}
                          </span>
                        </div>
                        {textContent ? (
                          <p className="text-sm text-zinc-100 leading-relaxed mt-1 whitespace-pre-wrap break-words">
                            {textContent}
                          </p>
                        ) : null}
                        {imageUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {imageUrls.slice(0, 4).map((url) => (
                              <Image
                                key={url}
                                src={url}
                                alt=""
                                width={160}
                                height={160}
                                className="rounded-lg object-cover h-32 w-32 shrink-0"
                                unoptimized
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="shrink-0 p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                        aria-label="More options"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </a>
              );
            } catch {
              const imageUrls = extractImageUrls(note.content);
              const textContent = contentWithoutImageUrls(note.content);
              return (
                <div
                  key={note.id}
                  className="block rounded-xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 size-10 rounded-full ring-2 ring-zinc-600 overflow-hidden bg-zinc-800">
                        {profile?.picture ? (
                          <Image
                            src={profile.picture}
                            alt=""
                            width={40}
                            height={40}
                            className="size-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="size-full bg-zinc-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">
                            {displayName}
                          </span>
                          {displayNip05 && (
                            <span className="text-zinc-500 text-xs">
                              {displayNip05}
                            </span>
                          )}
                          <span className="text-zinc-600 text-xs">·</span>
                          <span className="text-zinc-600 text-xs">
                            {formatRelativeTime(note.created_at)}
                          </span>
                        </div>
                        {textContent ? (
                          <p className="text-sm text-zinc-100 leading-relaxed mt-1 whitespace-pre-wrap break-words">
                            {textContent}
                          </p>
                        ) : null}
                        {imageUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {imageUrls.slice(0, 4).map((url) => (
                              <Image
                                key={url}
                                src={url}
                                alt=""
                                width={160}
                                height={160}
                                className="rounded-lg object-cover h-32 w-32 shrink-0"
                                unoptimized
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        className="shrink-0 p-1 rounded hover:bg-zinc-800 text-zinc-500"
                        aria-label="More options"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50">
        <a
          className="flex items-center justify-between text-[10px] font-mono text-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
          href={siteConfig.nostr.globalFeedHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Global Feed
          <ArrowUpRight className="text-xs" size={12} />
        </a>
      </div>
    </div>
  );
}

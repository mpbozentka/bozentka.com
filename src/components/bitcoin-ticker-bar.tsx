"use client";

import { useEffect, useState } from "react";

export function BitcoinTickerBar() {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockHeight = async () => {
      try {
        const res = await fetch("https://mempool.space/api/blocks/tip/height");
        if (res.ok) {
          const height = await res.json();
          setBlockHeight(typeof height === "number" ? height : null);
          setError(null);
        } else {
          setError("—");
        }
      } catch {
        setError("—");
      }
    };

    fetchBlockHeight();
    const interval = setInterval(fetchBlockHeight, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-zinc-900/50 border-b border-zinc-800/50 px-6 md:px-20 py-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <svg
          className="size-4 text-bitcoin"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.471-1.24 14.912.352c6.43 1.614 10.332 8.125 8.726 14.552zm-15.01-6.906c-.31-1.242-2.027-.614-2.027-.614l-.409-1.644-1.031.258.4 1.614c-.26.067-.54.135-.803.21l-.403-1.618-1.03.257.41 1.64c-.21.055-.42.11-.64.165l-1.423.355.271 1.085s.768-.175.753-.16c.419-.105.62.158.706.316l.512 2.055c.03.077.07.19.014.285-.05.074-.15.118-.15.118l-.513-2.06s-.65.163-.8.204c-.112.028-.278.07-.37.247-.076.15-.034.34-.034.34l1.3.324c.24.06.47.12.7.18l.41 1.66 1.03-.257-.403-1.63c.28-.07.55-.14.82-.21l.41 1.64 1.03-.257-.41-1.645c1.76-.334 3.085-1.0 2.76-2.614-.26-1.3-.924-1.92-2.228-2.22.61-.14 1.07-.54 1.19-1.36zm-2.03 3.65c-.32 1.28-2.48.59-2.48.59l-.45-1.785s2.16-.54 2.45.63.2.98.48 1.195zm.32-3.32c-.29 1.17-2.1.58-2.1.58l.4-1.61s1.81-.45 2.1.72-.11 1.05-.4 1.31z" />
        </svg>
        <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
          Block Height
        </span>
      </div>
      <div className="flex items-center gap-4">
        {blockHeight != null ? (
          <span className="font-mono text-xs text-white tabular-nums tracking-tighter">
            #{blockHeight.toLocaleString()}
          </span>
        ) : (
          <span className="text-xs text-zinc-500 font-mono">{error ?? "—"}</span>
        )}
      </div>
    </div>
  );
}

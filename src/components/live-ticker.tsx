"use client";

import { useEffect, useState } from "react";
import { Bitcoin, TrendingDown, TrendingUp } from "lucide-react";

interface BitcoinData {
  usd: number;
  usd_24h_change?: number;
}

export function LiveTicker() {
  const [btcPrice, setBtcPrice] = useState<BitcoinData | null>(null);
  const [btcError, setBtcError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    { position: number; name: string; score: string; thru: string }[]
  >([]);
  const [eventName, setEventName] = useState<string>("");

  // Fetch Bitcoin price from CoinGecko (no API key required)
  useEffect(() => {
    const fetchBtc = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await res.json();
        if (data?.bitcoin) {
          setBtcPrice(data.bitcoin);
          setBtcError(null);
        } else {
          setBtcError("Unable to fetch");
        }
      } catch {
        setBtcError("Connection error");
      }
    };

    fetchBtc();
    const interval = setInterval(fetchBtc, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch PGA leaderboard - uses Live Golf API if NEXT_PUBLIC_LIVE_GOLF_API_KEY is set
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_LIVE_GOLF_API_KEY;
    const defaultEvent = "WM Phoenix Open";
    const defaultLeaderboard = [
      { position: 1, name: "Scottie Scheffler", score: "-8", thru: "F" },
      { position: 2, name: "Wyndham Clark", score: "-6", thru: "F" },
      { position: 3, name: "Sahith Theegala", score: "-5", thru: "F" },
      { position: 4, name: "Tom Kim", score: "-4", thru: "F" },
      { position: 5, name: "Jordan Spieth", score: "-3", thru: "F" },
    ];

    if (!apiKey) {
      setEventName(defaultEvent);
      setLeaderboard(defaultLeaderboard);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        const eventsRes = await fetch(
          `https://use.livegolfapi.com/v1/events?api_key=${apiKey}&tour=pga-tour`
        );
        const eventsData = await eventsRes.json();

        if (!Array.isArray(eventsData) || eventsData.length === 0) {
          setEventName(defaultEvent);
          setLeaderboard(defaultLeaderboard);
          return;
        }

        const activeEvent = eventsData.find(
          (e: { status: string }) => e.status === "In Progress"
        );
        const event = activeEvent || eventsData[eventsData.length - 1];
        setEventName(event.name || defaultEvent);

        const lbRes = await fetch(
          `https://use.livegolfapi.com/v1/events/${event.id}/leaderboard?api_key=${apiKey}`
        );

        if (!lbRes.ok) {
          setEventName(event.name || defaultEvent);
          setLeaderboard(defaultLeaderboard);
          return;
        }

        const lbData = await lbRes.json();
        const entries = Array.isArray(lbData)
          ? lbData
          : lbData?.entries || lbData?.leaderboard || lbData?.players || [];
        const topFive = entries.slice(0, 5).map(
          (
            p: {
              position?: number;
              playerName?: string;
              displayName?: string;
              name?: string;
              total?: string | number;
              score?: string | number;
              thru?: string | number;
            },
            i: number
          ) => ({
            position: p.position ?? i + 1,
            name: p.playerName || p.displayName || p.name || "—",
            score: String(p.total ?? p.score ?? "—"),
            thru: String(p.thru ?? "F"),
          })
        );

        if (topFive.length > 0) {
          setLeaderboard(topFive);
        } else {
          setLeaderboard(defaultLeaderboard);
        }
      } catch {
        setEventName(defaultEvent);
        setLeaderboard(defaultLeaderboard);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Bitcoin className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-500">BTC</span>
              <div className="flex items-center gap-2">
                {btcPrice ? (
                  <>
                    <span className="font-semibold text-white">
                      ${btcPrice.usd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    {btcPrice.usd_24h_change != null && (
                      <span
                        className={`flex items-center gap-0.5 text-xs ${
                          btcPrice.usd_24h_change >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {btcPrice.usd_24h_change >= 0 ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                        {Math.abs(btcPrice.usd_24h_change).toFixed(2)}%
                      </span>
                    )}
                  </>
                ) : btcError ? (
                  <span className="text-sm text-slate-500">{btcError}</span>
                ) : (
                  <span className="text-sm text-slate-500">—</span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden h-6 w-px bg-slate-700 sm:block" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-500">{eventName}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {leaderboard.slice(0, 5).map((p) => (
                <span key={p.position} className="text-slate-300">
                  <span className="font-medium text-slate-400">{p.position}.</span>{" "}
                  {p.name}
                  <span className="ml-1 text-emerald-400">{p.score}</span>
                  <span className="ml-1 text-slate-500">({p.thru})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

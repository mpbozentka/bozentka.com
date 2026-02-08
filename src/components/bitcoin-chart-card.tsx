"use client";

import { useEffect, useState } from "react";

interface WeeklyCandle {
  weekStart: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

function aggregateWeeklyCandles(
  prices: [number, number][]
): WeeklyCandle[] {
  if (!prices?.length) return [];
  const byWeek = new Map<number, number[]>();
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  for (const [ts, p] of prices) {
    const weekKey = Math.floor(ts / weekMs) * weekMs;
    if (!byWeek.has(weekKey)) byWeek.set(weekKey, []);
    byWeek.get(weekKey)!.push(p);
  }

  const candles: WeeklyCandle[] = [];
  const sortedWeeks = Array.from(byWeek.keys()).sort((a, b) => a - b);
  for (const weekKey of sortedWeeks) {
    const vals = byWeek.get(weekKey)!;
    const open = vals[0]!;
    const close = vals[vals.length - 1]!;
    const high = Math.max(...vals);
    const low = Math.min(...vals);
    candles.push({
      weekStart: new Date(weekKey).toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
    });
  }
  return candles;
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatVol(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return n.toLocaleString();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function BitcoinChartCard() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [weeklyCandles, setWeeklyCandles] = useState<WeeklyCandle[]>([]);
  const [volume, setVolume] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<WeeklyCandle | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [priceRes, chartRes] = await Promise.all([
          fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
          ),
          fetch(
            "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365"
          ),
        ]);

        if (!priceRes.ok || !chartRes.ok) {
          setError("Unable to load");
          return;
        }

        const priceJson = await priceRes.json();
        const chartJson = await chartRes.json();

        if (!cancelled && priceJson?.bitcoin?.usd != null) {
          setCurrentPrice(priceJson.bitcoin.usd);
        }

        const prices = chartJson?.prices as [number, number][] | undefined;
        if (!cancelled && Array.isArray(prices) && prices.length > 0) {
          const candles = aggregateWeeklyCandles(prices);
          setWeeklyCandles(candles.slice(-52)); // last 52 weeks
        }

        const volumes = chartJson?.total_volumes as [number, number][] | undefined;
        if (!cancelled && Array.isArray(volumes) && volumes.length > 0) {
          const totalVol = volumes.reduce((sum, [, v]) => sum + (v || 0), 0);
          setVolume(totalVol);
        }

        setError(null);
      } catch {
        if (!cancelled) setError("Connection error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const high = weeklyCandles.length
    ? Math.max(...weeklyCandles.map((c) => c.high))
    : null;
  const low = weeklyCandles.length
    ? Math.min(...weeklyCandles.map((c) => c.low))
    : null;
  const range = high != null && low != null && low > 0 ? high - low : 1;
  const displayCandles = weeklyCandles.slice(-52);
  const quarterlyLabelIndices = [0, 13, 26, 39];
  const quarterlyLabels =
    displayCandles.length >= 40
      ? quarterlyLabelIndices.map((i) => {
          const d = new Date(displayCandles[i]!.weekStart);
          return { index: i, label: MONTHS[d.getMonth()] };
        })
      : [];

  return (
    <div className="md:col-span-5 bento-card rounded-xl p-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em]">
          BTC / USD • 12M
        </span>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary" />
          <span className="text-white text-[10px] font-mono uppercase tracking-widest">
            Live
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[160px]">
          <div className="flex gap-1.5">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center min-h-[160px] text-zinc-500 text-xs">
          {error}
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col justify-end min-h-[140px]">
            <div className="mb-1 h-4 font-mono text-[10px] text-zinc-400">
              {hoveredCandle != null
                ? `Close ${formatPrice(hoveredCandle.close)}`
                : "\u00A0"}
            </div>
            <div className="h-32 flex items-end gap-px mb-1 relative">
              {displayCandles.map((c) => {
                const isUp = c.close >= c.open;
                const bodyTop = Math.max(c.open, c.close);
                const bodyBottom = Math.min(c.open, c.close);
                const wickBottomPct = ((c.low - low!) / range) * 100;
                const wickTopPct = ((c.high - low!) / range) * 100;
                const bodyBottomPct = ((bodyBottom - low!) / range) * 100;
                const bodyTopPct = ((bodyTop - low!) / range) * 100;
                const bodyHeightPct = Math.max(1, bodyTopPct - bodyBottomPct);
                return (
                  <div
                    key={c.weekStart}
                    className="flex-1 min-w-0 h-full relative group/candle"
                    onMouseEnter={() => setHoveredCandle(c)}
                    onMouseLeave={() => setHoveredCandle(null)}
                    title={`O: ${formatPrice(c.open)} H: ${formatPrice(c.high)} L: ${formatPrice(c.low)} C: ${formatPrice(c.close)}`}
                  >
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-px opacity-50 group-hover/candle:opacity-100 transition-opacity ${
                        isUp ? "bg-primary" : "bg-red-400"
                      }`}
                      style={{
                        bottom: `${wickBottomPct}%`,
                        height: `${wickTopPct - wickBottomPct}%`,
                      }}
                    />
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-full min-w-[2px] max-w-[5px] rounded-sm transition-opacity group-hover/candle:opacity-100 ${
                        isUp ? "bg-primary" : "bg-red-400/90"
                      }`}
                      style={{
                        bottom: `${bodyBottomPct}%`,
                        height: `${bodyHeightPct}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="h-4 flex relative font-mono text-[9px] text-zinc-600 uppercase">
              {quarterlyLabels.map(({ index, label }) => (
                <span
                  key={index}
                  className="absolute -translate-x-1/2"
                  style={{
                    left: `${((index + 0.5) / displayCandles.length) * 100}%`,
                  }}
                >
                  {label}
                </span>
              ))}
              <span className="absolute right-0">Now</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800/50 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                Price
              </p>
              <p className="text-xl font-mono tabular-nums text-white">
                {currentPrice != null ? formatPrice(currentPrice) : "—"}
              </p>
            </div>
            {high != null && (
              <div className="text-right">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                  High (12M)
                </p>
                <p className="text-sm font-mono text-zinc-400 tabular-nums">
                  {formatPrice(high)}
                </p>
              </div>
            )}
            {volume != null && (
              <div className="text-right">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                  Est. Vol
                </p>
                <p className="text-sm font-mono text-zinc-400 tabular-nums">
                  {formatVol(volume)}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

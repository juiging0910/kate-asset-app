export const config = { runtime: "edge" };

const SYMBOLS = [
  { name: "台灣加權", symbol: "^TWII" },
  { name: "S&P 500",  symbol: "^GSPC" },
  { name: "那斯達克",  symbol: "^IXIC" },
  { name: "日經 225",  symbol: "^N225" },
];

async function fetchOne(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://finance.yahoo.com/",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) throw new Error("no price");
  const price = meta.regularMarketPrice;
  const prev = meta.chartPreviousClose || meta.previousClose || price;
  const chgAbs = price - prev;
  const chgPct = prev > 0 ? (chgAbs / prev) * 100 : 0;
  const up = chgAbs >= 0;
  const fmt = (n) =>
    n >= 10000
      ? Math.round(n).toLocaleString("en-US")
      : n >= 1000
      ? n.toLocaleString("en-US", { maximumFractionDigits: 2 })
      : n.toFixed(2);
  return { price: fmt(price), chg: `${up ? "+" : ""}${chgPct.toFixed(2)}%`, up };
}

export default async function handler(req) {
  const results = await Promise.allSettled(SYMBOLS.map((s) => fetchOne(s.symbol)));
  const indices = results
    .map((r, i) => {
      if (r.status === "fulfilled") {
        return {
          name: SYMBOLS[i].name,
          val: r.value.price,
          chg: r.value.chg,
          up: r.value.up,
          loading: false,
        };
      }
      return null;
    })
    .filter(Boolean);

  return new Response(JSON.stringify({ indices, updatedAt: new Date().toISOString() }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}

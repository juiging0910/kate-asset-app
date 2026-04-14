export const config = { runtime: "edge" };

const DEFAULT_SYMBOLS = [
  { name: "台灣加權", symbol: "^TWII" },
  { name: "S&P 500",  symbol: "^GSPC" },
  { name: "那斯達克",  symbol: "^IXIC" },
  { name: "日經 225",  symbol: "^N225" },
];

const METAL_NAMES = {
  "GC=F": "黃金", "SI=F": "白銀", "PL=F": "鉑金",
};

async function fetchOne(symbolObj) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbolObj.symbol)}?interval=1d&range=2d`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "application/json,text/plain,*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://finance.yahoo.com/",
      "Origin": "https://finance.yahoo.com",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${symbolObj.symbol}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) throw new Error(`no price for ${symbolObj.symbol}`);
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
  return {
    name: symbolObj.name,
    val: fmt(price),
    chg: `${up ? "+" : ""}${chgPct.toFixed(2)}%`,
    up,
    loading: false,
  };
}

export default async function handler(req) {
  const url = new URL(req.url);
  const symbolsParam = url.searchParams.get("symbols");
  let targets = DEFAULT_SYMBOLS;
  if (symbolsParam) {
    targets = symbolsParam.split(",").map((s) => ({
      symbol: decodeURIComponent(s),
      name: METAL_NAMES[decodeURIComponent(s)] || decodeURIComponent(s),
    }));
  }

  const results = await Promise.allSettled(targets.map(fetchOne));
  const indices = results
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter(Boolean);

  return new Response(
    JSON.stringify({ indices, updatedAt: new Date().toISOString() }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}

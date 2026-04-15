/**
 * api/db.js  —  Vercel Edge Function
 *
 * 代理所有 Supabase REST 呼叫，讓 SUPABASE_KEY 留在伺服器端。
 * 前端改呼叫 /api/db?path=/kate_users&...，此函式加上金鑰後轉發。
 *
 * 環境變數：
 *   SUPABASE_URL    — 例如 https://xxxx.supabase.co
 *   SUPABASE_KEY    — Supabase service_role 或 anon key
 *   ALLOWED_ORIGIN  — 同 ai.js
 */

export const config = { runtime: "edge" };

export default async function handler(req) {
  const origin = req.headers.get("origin") || "";
  const allowed = process.env.ALLOWED_ORIGIN || "";
  const corsOrigin = allowed ? (origin === allowed ? origin : allowed) : "*";

  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Prefer",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_KEY;

  if (!supaUrl || !supaKey) {
    return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 從 query string 取出 Supabase REST path，例如 ?path=/kate_users&username=eq.alice
  const url = new URL(req.url);
  const restPath = url.searchParams.get("path") || "";
  url.searchParams.delete("path");

  // 重組 query string（移除 path 後剩下的都轉發）
  const qs = url.searchParams.toString();
  const target = `${supaUrl}/rest/v1${restPath}${qs ? "?" + qs : ""}`;

  // 轉發 Prefer header（Supabase upsert 需要）
  const prefer = req.headers.get("Prefer") || "";

  const upstreamHeaders = {
    "apikey": supaKey,
    "Authorization": `Bearer ${supaKey}`,
    "Content-Type": "application/json",
    "Prefer": prefer || "return=representation",
  };

  let bodyText = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    bodyText = await req.text();
  }

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: upstreamHeaders,
      body: bodyText || undefined,
    });

    const text = await upstream.text();

    return new Response(text || null, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "DB request failed", detail: err.message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

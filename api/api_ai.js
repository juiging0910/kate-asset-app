/**
 * api/ai.js  —  Vercel Edge Function
 *
 * 統一代理所有 Anthropic API 呼叫，讓 ANTHROPIC_KEY 永遠留在伺服器端。
 * 前端改呼叫 POST /api/ai，傳入相同的 body，此函式負責加上金鑰後轉發。
 *
 * 環境變數（在 Vercel Dashboard → Settings → Environment Variables 設定）：
 *   ANTHROPIC_KEY       — Anthropic API 金鑰（必填）
 *   ALLOWED_ORIGIN      — 允許的前端 origin，例如 https://your-app.vercel.app
 *                         留空則允許所有 origin（開發用）
 */

export const config = { runtime: "edge" };

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export default async function handler(req) {
  // ── CORS ──
  const origin = req.headers.get("origin") || "";
  const allowed = process.env.ALLOWED_ORIGIN || "";
  const corsOrigin = allowed ? (origin === allowed ? origin : allowed) : "*";

  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const key = process.env.ANTHROPIC_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "Server misconfiguration: missing API key" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 強制使用指定模型，防止前端任意傳入高費率模型
  if (!body.model || !body.model.startsWith("claude-")) {
    body.model = "claude-sonnet-4-20250514";
  }

  // max_tokens 上限保護（避免意外高消耗）
  if (!body.max_tokens || body.max_tokens > 4000) {
    body.max_tokens = body.max_tokens || 1000;
  }

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Upstream request failed", detail: err.message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

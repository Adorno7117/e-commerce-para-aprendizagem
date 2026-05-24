import { NextRequest } from "next/server";
import { env } from "@/lib/env";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  bucket.count += 1;
  return { ok: bucket.count <= limit, remaining: Math.max(limit - bucket.count, 0) };
}

export function assertSameOrigin(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") return;

  const origin = request.headers.get("origin");
  if (!origin) return;

  const allowed = new URL(env.APP_URL).origin;
  if (origin !== allowed && process.env.NODE_ENV === "production") {
    throw new Error("Origem da requisicao recusada.");
  }
}

export function publicError(message = "Nao foi possivel processar a solicitacao.", status = 400) {
  return Response.json({ error: message }, { status });
}

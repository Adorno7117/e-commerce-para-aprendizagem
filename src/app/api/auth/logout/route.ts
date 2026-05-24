import { NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  assertSameOrigin(request);
  await clearSessionCookie();
  return Response.json({ ok: true });
}

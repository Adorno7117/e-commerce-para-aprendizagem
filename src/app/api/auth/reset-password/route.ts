import { NextRequest } from "next/server";
import { resetPasswordSchema } from "@/lib/validators";
import { assertSameOrigin, clientIp, publicError, rateLimit } from "@/lib/security";
import { resetPassword } from "@/server/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const limited = rateLimit(`reset:${clientIp(request)}`, 5, 60_000);
    if (!limited.ok) return publicError("Muitas tentativas. Tente novamente em instantes.", 429);

    const input = resetPasswordSchema.parse(await request.json());
    await resetPassword(input.token, input.password);
    return Response.json({ ok: true });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

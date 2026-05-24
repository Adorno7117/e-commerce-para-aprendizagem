import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validators";
import { assertSameOrigin, clientIp, publicError, rateLimit } from "@/lib/security";
import { createPasswordReset } from "@/server/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const limited = rateLimit(`forgot:${clientIp(request)}`, 4, 60_000);
    if (!limited.ok) return publicError("Muitas tentativas. Tente novamente em instantes.", 429);

    const input = forgotPasswordSchema.parse(await request.json());
    const token = await createPasswordReset(input.email);
    return Response.json({
      ok: true,
      message: "Se o email existir, enviaremos instrucoes de recuperacao.",
      devResetToken: process.env.NODE_ENV === "development" ? token : undefined
    });
  } catch {
    return Response.json({ ok: true, message: "Se o email existir, enviaremos instrucoes de recuperacao." });
  }
}

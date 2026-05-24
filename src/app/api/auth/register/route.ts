import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validators";
import { assertSameOrigin, clientIp, publicError, rateLimit } from "@/lib/security";
import { registerUser } from "@/server/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const limited = rateLimit(`register:${clientIp(request)}`, 5, 60_000);
    if (!limited.ok) return publicError("Muitas tentativas. Tente novamente em instantes.", 429);

    const input = registerSchema.parse(await request.json());
    const user = await registerUser(input);
    return Response.json({ user });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

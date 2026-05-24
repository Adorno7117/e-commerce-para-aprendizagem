import { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validators";
import { assertSameOrigin, clientIp, publicError, rateLimit } from "@/lib/security";
import { loginUser } from "@/server/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const limited = rateLimit(`login:${clientIp(request)}`, 8, 60_000);
    if (!limited.ok) return publicError("Muitas tentativas. Tente novamente em instantes.", 429);

    const input = loginSchema.parse(await request.json());
    const user = await loginUser(input);
    return Response.json({ user });
  } catch {
    return publicError("Email ou senha invalidos.", 401);
  }
}

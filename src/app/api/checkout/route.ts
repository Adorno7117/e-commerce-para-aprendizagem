import { NextRequest } from "next/server";
import { readSession } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validators";
import { assertSameOrigin, clientIp, publicError, rateLimit } from "@/lib/security";
import { createOrderFromCart } from "@/server/services/order.service";
import { createPaymentIntent } from "@/server/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const limited = rateLimit(`checkout:${clientIp(request)}`, 12, 60_000);
    if (!limited.ok) return publicError("Muitas tentativas. Tente novamente em instantes.", 429);

    const session = await readSession();
    const input = checkoutSchema.parse(await request.json());
    const { order, accessToken } = await createOrderFromCart(session, input);
    const payment = await createPaymentIntent({
      publicId: order.publicId,
      totalCents: order.totalCents,
      customerEmail: order.customerEmail,
      accessToken
    });

    return Response.json({
      order: { publicId: order.publicId, status: order.status, totalCents: order.totalCents },
      accessToken,
      payment
    });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

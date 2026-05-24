import Stripe from "stripe";
import { env } from "@/lib/env";
import { hmacSha256, safeEqual } from "@/lib/crypto";
import { markOrderPaid } from "@/server/services/order.service";

export async function createPaymentIntent(input: {
  publicId: string;
  totalCents: number;
  customerEmail: string;
  accessToken: string;
}) {
  if (env.PAYMENT_PROVIDER === "stripe" && env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.customerEmail,
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: input.totalCents,
            product_data: { name: `Pedido ${input.publicId}` }
          },
          quantity: 1
        }
      ],
      metadata: { publicId: input.publicId },
      success_url: `${env.APP_URL}/checkout/sucesso?pedido=${input.publicId}&access=${input.accessToken}`,
      cancel_url: `${env.APP_URL}/checkout?cancelado=1`
    });
    return { provider: "stripe", redirectUrl: session.url ?? env.APP_URL };
  }

  if (env.MOCK_AUTO_APPROVE === "true") {
    await markOrderPaid(input.publicId, `mock_${Date.now()}`, { provider: "mock", approvedBy: "server" });
  }

  return {
    provider: "mock",
    redirectUrl: `${env.APP_URL}/checkout/sucesso?pedido=${input.publicId}&access=${input.accessToken}`
  };
}

export async function handleMockWebhook(rawBody: string, signature: string | null) {
  const expected = hmacSha256(rawBody, env.PAYMENT_WEBHOOK_SECRET);
  if (!signature || !safeEqual(signature, expected)) {
    throw new Error("Assinatura invalida.");
  }

  const payload = JSON.parse(rawBody) as { publicId: string; paymentId?: string };
  await markOrderPaid(payload.publicId, payload.paymentId ?? `mock_${Date.now()}`, { provider: "mock" });
}

export async function handleStripeWebhook(rawBody: string, signature: string | null) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe nao configurado.");
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const event = stripe.webhooks.constructEvent(rawBody, signature ?? "", env.STRIPE_WEBHOOK_SECRET);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const publicId = session.metadata?.publicId;
    if (publicId) {
      await markOrderPaid(publicId, session.id, {
        provider: "stripe",
        event: event.type,
        livemode: event.livemode
      });
    }
  }
}

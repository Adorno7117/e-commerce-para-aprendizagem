import { NextRequest } from "next/server";
import { publicError } from "@/lib/security";
import { handleStripeWebhook } from "@/server/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    await handleStripeWebhook(rawBody, request.headers.get("stripe-signature"));
    return Response.json({ received: true });
  } catch {
    return publicError("Webhook recusado.", 400);
  }
}

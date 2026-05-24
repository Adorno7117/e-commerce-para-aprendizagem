import { NextRequest } from "next/server";
import { publicError } from "@/lib/security";
import { handleMockWebhook } from "@/server/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    await handleMockWebhook(rawBody, request.headers.get("x-mock-signature"));
    return Response.json({ received: true });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

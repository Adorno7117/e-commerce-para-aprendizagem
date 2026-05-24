import { NextRequest } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { assertSameOrigin, publicError } from "@/lib/security";
import { addToCart, getCart } from "@/server/services/cart.service";

const addSchema = z.object({ productId: z.string().min(1) });

export async function GET() {
  const session = await readSession();
  const cart = await getCart(session);
  return Response.json(cart);
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const session = await readSession();
    const input = addSchema.parse(await request.json());
    await addToCart(input.productId, session);
    return Response.json(await getCart(session));
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

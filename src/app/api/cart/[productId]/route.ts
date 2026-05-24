import { NextRequest } from "next/server";
import { readSession } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/security";
import { getCart, removeFromCart } from "@/server/services/cart.service";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  assertSameOrigin(request);
  const session = await readSession();
  const { productId } = await params;
  await removeFromCart(productId, session);
  return Response.json(await getCart(session));
}

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, publicError } from "@/lib/security";
import { productInputSchema } from "@/lib/validators";

export async function GET() {
  await requireAdmin();
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return Response.json({ products });
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const input = productInputSchema.parse(await request.json());
    const product = await prisma.product.create({ data: input });
    await prisma.adminLog.create({ data: { userId: admin.id, action: "product.create", metadata: { productId: product.id } } });
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

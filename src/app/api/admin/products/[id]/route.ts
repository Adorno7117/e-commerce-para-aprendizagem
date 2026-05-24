import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, publicError } from "@/lib/security";
import { productInputSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const input = productInputSchema.partial().parse(await request.json());
    const { id } = await params;
    const product = await prisma.product.update({ where: { id }, data: input });
    await prisma.adminLog.create({ data: { userId: admin.id, action: "product.update", metadata: { productId: product.id } } });
    return Response.json({ product });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const { id } = await params;
    await prisma.product.update({ where: { id }, data: { status: "INACTIVE" } });
    await prisma.adminLog.create({ data: { userId: admin.id, action: "product.deactivate", metadata: { productId: id } } });
    return Response.json({ ok: true });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

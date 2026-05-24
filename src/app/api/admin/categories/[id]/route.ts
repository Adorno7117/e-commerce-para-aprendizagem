import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, publicError } from "@/lib/security";
import { categoryInputSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const input = categoryInputSchema.partial().parse(await request.json());
    const { id } = await params;
    const category = await prisma.category.update({ where: { id }, data: input });
    await prisma.adminLog.create({ data: { userId: admin.id, action: "category.update", metadata: { categoryId: category.id } } });
    return Response.json({ category });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

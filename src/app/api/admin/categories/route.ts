import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, publicError } from "@/lib/security";
import { categoryInputSchema } from "@/lib/validators";

export async function GET() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return Response.json({ categories });
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const input = categoryInputSchema.parse(await request.json());
    const category = await prisma.category.create({ data: input });
    await prisma.adminLog.create({ data: { userId: admin.id, action: "category.create", metadata: { categoryId: category.id } } });
    return Response.json({ category }, { status: 201 });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

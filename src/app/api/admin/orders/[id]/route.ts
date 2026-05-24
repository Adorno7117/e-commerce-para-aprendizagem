import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, publicError } from "@/lib/security";

const statusSchema = z.object({ status: z.enum(["PENDING", "PAID", "CANCELED", "FAILED", "REFUNDED"]) });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const input = statusSchema.parse(await request.json());
    const { id } = await params;
    const order = await prisma.order.update({ where: { id }, data: { status: input.status } });
    await prisma.adminLog.create({ data: { userId: admin.id, action: "order.status", metadata: { orderId: order.id, status: input.status } } });
    return Response.json({ order });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

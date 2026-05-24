import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [orders, paidOrders, users, products, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ where: { status: "PAID" }, include: { items: true } }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.orderItem.groupBy({
      by: ["productName"],
      where: { order: { status: "PAID" } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5
    })
  ]);

  const revenueCents = paidOrders.reduce((sum, order) => sum + order.totalCents, 0);
  return { orders, paidOrders: paidOrders.length, revenueCents, users, products, topProducts };
}

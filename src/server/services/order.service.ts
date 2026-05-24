import { OrderStatus, PaymentStatus, Prisma, ProductStatus } from "@prisma/client";
import { createOpaqueToken, sha256 } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth";
import { getCart, clearCart } from "@/server/services/cart.service";

function publicOrderId() {
  return `PED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

async function calculateDiscount(couponCode: string | undefined, subtotalCents: number) {
  if (!couponCode) return { coupon: null, discountCents: 0 };

  const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
  const invalid =
    !coupon ||
    !coupon.active ||
    (coupon.expiresAt && coupon.expiresAt < new Date()) ||
    (coupon.maxRedemptions !== null && coupon.redeemedCount >= coupon.maxRedemptions);

  if (invalid) throw new Error("Cupom invalido ou expirado.");

  const percent = coupon.percentOff ? Math.floor((subtotalCents * coupon.percentOff) / 100) : 0;
  const amount = coupon.amountOffCents ?? 0;
  return { coupon, discountCents: Math.min(subtotalCents, percent + amount) };
}

export async function createOrderFromCart(
  session: SessionUser | null,
  input: { name: string; email: string; couponCode?: string }
) {
  const { items, subtotalCents } = await getCart(session);
  if (items.length === 0) throw new Error("O carrinho esta vazio.");

  const unavailable = items.find((item) => item.product.status !== ProductStatus.ACTIVE);
  if (unavailable) throw new Error(`Produto indisponivel: ${unavailable.product.name}`);

  const { coupon, discountCents } = await calculateDiscount(input.couponCode, subtotalCents);
  const totalCents = Math.max(subtotalCents - discountCents, 0);
  const accessToken = createOpaqueToken();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        publicId: publicOrderId(),
        userId: session?.id,
        customerName: input.name,
        customerEmail: input.email,
        subtotalCents,
        discountCents,
        totalCents,
        couponId: coupon?.id,
        accessTokenHash: sha256(accessToken),
        accessTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSlug: item.product.slug,
            productFileKey: item.product.fileKey,
            unitPriceCents: item.product.priceCents,
            quantity: 1
          }))
        },
        payments: {
          create: {
            provider: process.env.PAYMENT_PROVIDER ?? "mock",
            status: PaymentStatus.PENDING,
            amountCents: totalCents
          }
        }
      },
      include: { payments: true, items: true }
    });

    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { redeemedCount: { increment: 1 } }
      });
    }

    return created;
  });

  await clearCart(session);
  return { order, accessToken };
}

export async function markOrderPaid(publicId: string, providerRef?: string, safeLog?: Prisma.InputJsonValue) {
  const order = await prisma.order.findUnique({
    where: { publicId },
    include: { payments: true, items: true }
  });
  if (!order) throw new Error("Pedido nao encontrado.");
  if (order.status === OrderStatus.PAID) return order;

  return prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: order.id }, data: { status: OrderStatus.PAID } });
    await tx.payment.updateMany({
      where: { orderId: order.id, status: PaymentStatus.PENDING },
      data: { status: PaymentStatus.APPROVED, providerRef, paidAt: new Date(), safeLog }
    });
    return tx.order.findUniqueOrThrow({
      where: { id: order.id },
      include: { payments: true, items: true }
    });
  });
}

export async function findAccessibleOrder(
  publicId: string,
  session: SessionUser | null,
  accessToken?: string | null
) {
  const order = await prisma.order.findUnique({
    where: { publicId },
    include: { items: true, payments: true }
  });
  if (!order) return null;

  const ownsOrder = session && (order.userId === session.id || session.role === "ADMIN");
  const hasGuestAccess =
    accessToken &&
    order.accessTokenHash === sha256(accessToken) &&
    (!order.accessTokenExpiresAt || order.accessTokenExpiresAt > new Date());

  if (!ownsOrder && !hasGuestAccess) return null;
  return order;
}

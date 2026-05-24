import { cookies } from "next/headers";
import { ProductStatus } from "@prisma/client";
import { createOpaqueToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth";

const CART_COOKIE = "digital_cart";

async function setCartCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function getOrCreateCart(session: SessionUser | null) {
  if (session) {
    const existing = await prisma.cart.findFirst({ where: { userId: session.id } });
    if (existing) return existing;
    return prisma.cart.create({ data: { userId: session.id } });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE)?.value ?? createOpaqueToken();
  let cart = await prisma.cart.findUnique({ where: { visitorToken: token } });
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        visitorToken: token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      }
    });
  }
  await setCartCookie(token);
  return cart;
}

async function getExistingCart(session: SessionUser | null) {
  if (session) {
    return prisma.cart.findFirst({ where: { userId: session.id } });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE)?.value;
  if (!token) return null;

  return prisma.cart.findUnique({ where: { visitorToken: token } });
}

export async function getCart(session: SessionUser | null) {
  const cart = await getExistingCart(session);
  if (!cart) {
    return { cart: null, items: [], subtotalCents: 0, totalCents: 0 };
  }

  const current = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: { product: { include: { category: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  const items = current?.items ?? [];
  const subtotalCents = items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  return { cart: current, items, subtotalCents, totalCents: subtotalCents };
}

export async function addToCart(productId: string, session: SessionUser | null) {
  const product = await prisma.product.findFirst({
    where: { id: productId, status: ProductStatus.ACTIVE }
  });
  if (!product) throw new Error("Produto indisponivel.");

  const cart = await getOrCreateCart(session);
  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: 1 },
    create: { cartId: cart.id, productId, quantity: 1 }
  });
}

export async function removeFromCart(productId: string, session: SessionUser | null) {
  const cart = await getExistingCart(session);
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
}

export async function clearCart(session: SessionUser | null) {
  const cart = await getExistingCart(session);
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createOpaqueToken, sha256 } from "@/lib/crypto";
import { hashPassword, verifyPassword } from "@/lib/password";
import { setSessionCookie, type SessionUser } from "@/lib/auth";

export async function registerUser(input: { name: string; email: string; password: string }) {
  const passwordHash = await hashPassword(input.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: "USER"
      },
      select: { id: true, email: true, name: true, role: true }
    });

    await prisma.order.updateMany({
      where: { userId: null, customerEmail: input.email },
      data: { userId: user.id }
    });

    await setSessionCookie(user);
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Nao foi possivel criar a conta com estes dados.");
    }
    throw error;
  }
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true, email: true, name: true, role: true, passwordHash: true }
  });

  if (!user?.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new Error("Email ou senha invalidos.");
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
  await setSessionCookie(sessionUser);
  return sessionUser;
}

export async function createPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const token = createOpaqueToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 30)
    }
  });

  return token;
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = sha256(token);
  const reset = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    throw new Error("Token invalido ou expirado.");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash: await hashPassword(password) }
    }),
    prisma.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: new Date() }
    })
  ]);
}

import { readFile } from "fs/promises";
import path from "path";
import { OrderStatus } from "@prisma/client";
import { createOpaqueToken, sha256 } from "@/lib/crypto";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth";
import { findAccessibleOrder } from "@/server/services/order.service";

function safePrivatePath(fileKey: string) {
  const base = path.resolve(env.PRIVATE_FILES_DIR);
  const target = path.resolve(base, fileKey);
  if (!target.startsWith(base)) throw new Error("Arquivo invalido.");
  return target;
}

export async function createDownloadToken(input: {
  publicId: string;
  orderItemId: string;
  session: SessionUser | null;
  accessToken?: string | null;
}) {
  const order = await findAccessibleOrder(input.publicId, input.session, input.accessToken);
  if (!order || order.status !== OrderStatus.PAID) {
    throw new Error("Download nao liberado para este pedido.");
  }

  const item = order.items.find((orderItem) => orderItem.id === input.orderItemId);
  if (!item) throw new Error("Item nao encontrado.");

  const token = createOpaqueToken();
  await prisma.digitalDownload.create({
    data: {
      orderItemId: item.id,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + env.DOWNLOAD_TOKEN_TTL_MINUTES * 60 * 1000)
    }
  });

  return token;
}

export async function consumeDownloadToken(token: string) {
  const tokenHash = sha256(token);
  const download = await prisma.digitalDownload.findUnique({
    where: { tokenHash },
    include: { orderItem: true }
  });

  if (!download || download.expiresAt < new Date() || download.downloads >= download.maxDownloads) {
    throw new Error("Link de download invalido ou expirado.");
  }

  const filePath = safePrivatePath(download.orderItem.productFileKey);
  const file = await readFile(filePath);

  await prisma.digitalDownload.update({
    where: { id: download.id },
    data: { downloads: { increment: 1 }, lastDownloadedAt: new Date() }
  });

  return {
    file,
    filename: path.basename(filePath),
    contentType: "application/octet-stream"
  };
}

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { assertSameOrigin, publicError } from "@/lib/security";

const MAX_SIZE = 1024 * 1024 * 100;

function safeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 120);
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await requireAdmin();
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) throw new Error("Arquivo obrigatorio.");
    if (file.size > MAX_SIZE) throw new Error("Arquivo maior que 100 MB.");

    const fileKey = `products/${Date.now()}-${safeName(file.name)}`;
    const base = path.resolve(env.PRIVATE_FILES_DIR);
    const target = path.resolve(base, fileKey);
    if (!target.startsWith(base)) throw new Error("Caminho invalido.");

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(await file.arrayBuffer()));

    return Response.json({ fileKey });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 400);
  }
}

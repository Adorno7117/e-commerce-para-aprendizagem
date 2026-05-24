import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: { category: true }
  });

  if (!product) return Response.json({ error: "Produto nao encontrado." }, { status: 404 });
  return Response.json({ product });
}

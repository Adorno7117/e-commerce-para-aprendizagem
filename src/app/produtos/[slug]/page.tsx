import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: { category: true }
  });

  if (!product) notFound();

  return (
    <main className="section">
      <div className="container two-col">
        <section className="panel stack">
          <img src={product.imageUrl} alt={product.name} style={{ borderRadius: 8, width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }} />
          <span className="pill">{product.category.name}</span>
          <h1>{product.name}</h1>
          <p className="lead">{product.shortDescription}</p>
          <p className="meta">{product.description}</p>
        </section>
        <aside className="panel stack">
          <span className="price">{money(product.priceCents)}</span>
          <AddToCartButton productId={product.id} />
          <div className="notice success">
            <ShieldCheck size={18} /> Download liberado apenas apos pagamento aprovado.
          </div>
        </aside>
      </div>
    </main>
  );
}

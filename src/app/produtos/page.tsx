import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="section">
      <div className="container stack">
        <div>
          <span className="eyebrow">Catalogo</span>
          <h1>Produtos digitais</h1>
          <p className="lead">Cursos, templates, sistemas, ebooks e arquivos baixaveis sem frete.</p>
        </div>
        <div className="grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </main>
  );
}

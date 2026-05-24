import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";
import { AdminProductForm } from "@/components/AdminProductForm";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <>
      <div>
        <span className="eyebrow">Admin</span>
        <h1>Produtos</h1>
      </div>
      <section className="panel">
        <h2>Novo produto</h2>
        <AdminProductForm categories={categories} />
      </section>
      <section className="panel table-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Categoria</th><th>Preco</th><th>Status</th><th>Arquivo</th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category.name}</td>
                <td>{money(product.priceCents)}</td>
                <td>{product.status}</td>
                <td>{product.fileKey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

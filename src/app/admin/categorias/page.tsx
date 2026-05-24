import { prisma } from "@/lib/prisma";
import { AdminCategoryForm } from "@/components/AdminCategoryForm";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });

  return (
    <>
      <div>
        <span className="eyebrow">Admin</span>
        <h1>Categorias</h1>
      </div>
      <section className="panel">
        <h2>Nova categoria</h2>
        <AdminCategoryForm />
      </section>
      <section className="panel table-wrap">
        <table>
          <thead><tr><th>Nome</th><th>Slug</th><th>Produtos</th><th>Descricao</th></tr></thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category._count.products}</td>
                <td>{category.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

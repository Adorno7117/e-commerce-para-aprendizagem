import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <main className="container admin-shell">
      <aside className="panel admin-nav">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/produtos">Produtos</Link>
        <Link href="/admin/categorias">Categorias</Link>
        <Link href="/admin/pedidos">Pedidos</Link>
        <Link href="/admin/usuarios">Usuarios</Link>
      </aside>
      <section className="stack">{children}</section>
    </main>
  );
}

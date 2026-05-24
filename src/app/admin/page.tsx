import { money } from "@/lib/format";
import { getDashboardStats } from "@/server/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <div>
        <span className="eyebrow">Admin</span>
        <h1>Dashboard</h1>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><span>Receita</span><strong>{money(stats.revenueCents)}</strong></div>
        <div className="kpi"><span>Pedidos pagos</span><strong>{stats.paidOrders}</strong></div>
        <div className="kpi"><span>Produtos</span><strong>{stats.products}</strong></div>
        <div className="kpi"><span>Usuarios</span><strong>{stats.users}</strong></div>
      </div>
      <section className="panel">
        <h2>Mais vendidos</h2>
        <div className="stack">
          {stats.topProducts.map((product) => (
            <div className="row" key={product.productName}>
              <span>{product.productName}</span>
              <strong>{product._sum.quantity ?? 0}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

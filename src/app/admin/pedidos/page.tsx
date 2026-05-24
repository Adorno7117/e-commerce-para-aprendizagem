import { prisma } from "@/lib/prisma";
import { dateTime, money } from "@/lib/format";
import { AdminOrderStatus } from "@/components/AdminOrderStatus";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, payments: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <div>
        <span className="eyebrow">Admin</span>
        <h1>Pedidos</h1>
      </div>
      <section className="panel table-wrap">
        <table>
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Status</th><th>Itens</th><th>Criado</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.publicId}</td>
                <td>{order.customerName}<br /><span className="meta">{order.customerEmail}</span></td>
                <td>{money(order.totalCents)}</td>
                <td><AdminOrderStatus id={order.id} status={order.status} /></td>
                <td>{order.items.map((item) => item.productName).join(", ")}</td>
                <td>{dateTime(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

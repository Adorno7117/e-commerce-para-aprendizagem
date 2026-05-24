import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dateTime, money } from "@/lib/format";
import { DownloadButton } from "@/components/DownloadButton";

export default async function CustomerPage() {
  const session = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="section">
      <div className="container stack">
        <div>
          <span className="eyebrow">Cliente</span>
          <h1>Minha biblioteca</h1>
          <p className="lead">Historico de pedidos e downloads digitais comprados.</p>
        </div>
        {orders.length === 0 ? <div className="panel">Voce ainda nao fez compras com esta conta.</div> : null}
        {orders.map((order) => (
          <section className="panel stack" key={order.id}>
            <div className="row">
              <div>
                <strong>{order.publicId}</strong>
                <p className="meta">{dateTime(order.createdAt)} · {order.status}</p>
              </div>
              <span className="price">{money(order.totalCents)}</span>
            </div>
            {order.items.map((item) => (
              <div className="row" key={item.id}>
                <span>{item.productName}</span>
                {order.status === "PAID" ? <DownloadButton publicId={order.publicId} orderItemId={item.id} /> : null}
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}

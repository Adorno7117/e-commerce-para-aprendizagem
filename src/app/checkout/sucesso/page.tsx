import Link from "next/link";
import { readSession } from "@/lib/auth";
import { money } from "@/lib/format";
import { findAccessibleOrder } from "@/server/services/order.service";
import { DownloadButton } from "@/components/DownloadButton";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ pedido?: string; access?: string }>;
}) {
  const session = await readSession();
  const query = await searchParams;
  const order = query.pedido
    ? await findAccessibleOrder(query.pedido, session, query.access)
    : null;

  return (
    <main className="section">
      <div className="container panel stack">
        <span className="eyebrow">Pedido</span>
        <h1>{order ? `Pedido ${order.publicId}` : "Pedido nao encontrado"}</h1>
        {order ? (
          <>
            <div className={order.status === "PAID" ? "notice success" : "notice"}>
              Status: {order.status === "PAID" ? "Pago" : "Aguardando pagamento"}
            </div>
            <p className="meta">Total: {money(order.totalCents)}. Guarde este link para acessar como visitante.</p>
            <div className="stack">
              {order.items.map((item) => (
                <div className="row" key={item.id}>
                  <div>
                    <strong>{item.productName}</strong>
                    <p className="meta">Arquivo protegido por link temporario.</p>
                  </div>
                  {order.status === "PAID" ? (
                    <DownloadButton publicId={order.publicId} orderItemId={item.id} accessToken={query.access} />
                  ) : null}
                </div>
              ))}
            </div>
            {!session ? <Link className="button secondary" href="/cadastro">Criar conta opcional</Link> : null}
          </>
        ) : (
          <Link className="button" href="/produtos">Voltar ao catalogo</Link>
        )}
      </div>
    </main>
  );
}

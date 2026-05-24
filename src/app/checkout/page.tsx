import Link from "next/link";
import { readSession } from "@/lib/auth";
import { money } from "@/lib/format";
import { getCart } from "@/server/services/cart.service";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await readSession();
  const cart = await getCart(session);

  if (cart.items.length === 0) {
    return (
      <main className="section">
        <div className="container panel stack">
          <h1>Seu carrinho esta vazio</h1>
          <Link className="button" href="/produtos">Escolher produtos</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container two-col">
        <section className="panel stack">
          <span className="eyebrow">Checkout</span>
          <h1>Finalize sua compra</h1>
          <p className="meta">Nao pedimos endereco nem frete para produtos digitais.</p>
          <CheckoutForm defaultName={session?.name} defaultEmail={session?.email} totalCents={cart.totalCents} />
        </section>
        <aside className="panel stack">
          <h2>Resumo</h2>
          {cart.items.map((item) => (
            <div className="row" key={item.id}>
              <span>{item.product.name}</span>
              <strong>{money(item.product.priceCents)}</strong>
            </div>
          ))}
          <div className="row price">
            <span>Total</span>
            <strong>{money(cart.totalCents)}</strong>
          </div>
          {!session ? <div className="notice">Voce pode comprar como visitante e criar conta depois.</div> : null}
        </aside>
      </div>
    </main>
  );
}

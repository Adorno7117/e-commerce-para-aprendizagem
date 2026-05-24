"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { money } from "@/lib/format";

type CartItem = {
  productId: string;
  quantity: number;
  product: {
    name: string;
    slug: string;
    priceCents: number;
    imageUrl: string;
  };
};

export function CartClient({ initialItems, initialTotal }: { initialItems: CartItem[]; initialTotal: number }) {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);

  async function remove(productId: string) {
    const response = await fetch(`/api/cart/${productId}`, { method: "DELETE" });
    if (!response.ok) return;
    const data = await response.json();
    setItems(data.items);
    setTotal(data.totalCents);
  }

  if (items.length === 0) {
    return (
      <div className="panel stack">
        <h1>Carrinho vazio</h1>
        <p className="meta">Escolha um produto digital para continuar.</p>
        <Link className="button" href="/produtos">Ver produtos</Link>
      </div>
    );
  }

  return (
    <div className="two-col">
      <section className="panel stack">
        <h1>Carrinho</h1>
        {items.map((item) => (
          <div className="row" key={item.productId}>
            <div>
              <strong>{item.product.name}</strong>
              <p className="meta">Quantidade digital limitada a {item.quantity}</p>
            </div>
            <div className="row">
              <span className="price">{money(item.product.priceCents)}</span>
              <button className="icon-button" type="button" onClick={() => remove(item.productId)} title="Remover">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </section>
      <aside className="panel stack">
        <h2>Resumo</h2>
        <div className="row">
          <span>Subtotal</span>
          <strong>{money(total)}</strong>
        </div>
        <div className="row">
          <span>Entrega digital</span>
          <strong>{money(0)}</strong>
        </div>
        <div className="row price">
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>
        <Link className="button full" href="/checkout">Ir para checkout</Link>
      </aside>
    </div>
  );
}

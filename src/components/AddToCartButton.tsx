"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ productId }: { productId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function add() {
    setState("loading");
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
    setState(response.ok ? "done" : "error");
  }

  return (
    <button className="button full" type="button" onClick={add} disabled={state === "loading"}>
      <ShoppingCart size={18} />
      {state === "loading" ? "Adicionando..." : state === "done" ? "No carrinho" : "Adicionar"}
    </button>
  );
}

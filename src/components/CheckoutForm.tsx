"use client";

import { FormEvent, useState } from "react";
import { CreditCard } from "lucide-react";
import { money } from "@/lib/format";

export function CheckoutForm({
  defaultName,
  defaultEmail,
  totalCents
}: {
  defaultName?: string;
  defaultEmail?: string;
  totalCents: number;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        couponCode: form.get("couponCode")
      })
    });

    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Erro no checkout.");
      return;
    }
    window.location.href = data.payment.redirectUrl;
  }

  return (
    <form className="form" onSubmit={submit}>
      {error ? <div className="notice error">{error}</div> : null}
      <label className="field">
        <span>Nome</span>
        <input className="input" name="name" required minLength={2} defaultValue={defaultName} />
      </label>
      <label className="field">
        <span>Email para entrega</span>
        <input className="input" name="email" type="email" required defaultValue={defaultEmail} />
      </label>
      <label className="field">
        <span>Cupom</span>
        <input className="input" name="couponCode" placeholder="BEMVINDO10" />
      </label>
      <div className="row price">
        <span>Total</span>
        <strong>{money(totalCents)}</strong>
      </div>
      <button className="button full" disabled={loading} type="submit">
        <CreditCard size={18} />
        {loading ? "Processando..." : "Finalizar pagamento"}
      </button>
    </form>
  );
}

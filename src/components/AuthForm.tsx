"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password")
      })
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Nao foi possivel continuar.");
      return;
    }
    window.location.href = "/cliente";
  }

  return (
    <form className="form" onSubmit={submit}>
      {error ? <div className="notice error">{error}</div> : null}
      {mode === "register" ? (
        <label className="field">
          <span>Nome</span>
          <input className="input" name="name" required minLength={2} />
        </label>
      ) : null}
      <label className="field">
        <span>Email</span>
        <input className="input" name="email" type="email" required />
      </label>
      <label className="field">
        <span>Senha</span>
        <input className="input" name="password" type="password" required minLength={8} />
      </label>
      <button className="button full" disabled={loading} type="submit">
        {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
      </button>
      {mode === "login" ? (
        <Link className="meta" href="/recuperar-senha">Esqueci minha senha</Link>
      ) : null}
    </form>
  );
}

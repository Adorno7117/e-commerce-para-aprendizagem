"use client";

import { FormEvent, useState } from "react";

export function ResetPasswordForm({ token }: { token?: string }) {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: form.get("token"), password: form.get("password") })
    });
    setMessage(response.ok ? "Senha redefinida com sucesso." : "Token invalido ou expirado.");
  }

  return (
    <form className="form" onSubmit={submit}>
      {message ? <div className="notice">{message}</div> : null}
      <label className="field">
        <span>Token</span>
        <input className="input" name="token" required defaultValue={token} />
      </label>
      <label className="field">
        <span>Nova senha</span>
        <input className="input" name="password" type="password" required minLength={8} />
      </label>
      <button className="button full" type="submit">Redefinir senha</button>
    </form>
  );
}

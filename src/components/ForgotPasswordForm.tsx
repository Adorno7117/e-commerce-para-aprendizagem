"use client";

import { FormEvent, useState } from "react";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") })
    });
    const data = await response.json();
    setMessage(data.devResetToken ? `${data.message} Token local: ${data.devResetToken}` : data.message);
  }

  return (
    <form className="form" onSubmit={submit}>
      {message ? <div className="notice success">{message}</div> : null}
      <label className="field">
        <span>Email</span>
        <input className="input" name="email" type="email" required />
      </label>
      <button className="button full" type="submit">Enviar recuperacao</button>
    </form>
  );
}

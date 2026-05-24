"use client";

import { FormEvent, useState } from "react";

export function AdminCategoryForm() {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        slug: form.get("slug"),
        description: form.get("description")
      })
    });
    setMessage(response.ok ? "Categoria cadastrada." : "Nao foi possivel cadastrar.");
    if (response.ok) window.location.reload();
  }

  return (
    <form className="form" onSubmit={submit}>
      {message ? <div className="notice">{message}</div> : null}
      <label className="field"><span>Nome</span><input className="input" name="name" required /></label>
      <label className="field"><span>Slug</span><input className="input" name="slug" required /></label>
      <label className="field"><span>Descricao</span><input className="input" name="description" /></label>
      <button className="button full" type="submit">Cadastrar categoria</button>
    </form>
  );
}

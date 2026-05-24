"use client";

import { FormEvent, useState } from "react";

export function AdminProductForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let fileKey = String(form.get("fileKey") ?? "");
    const file = form.get("file");

    if (file instanceof File && file.size > 0) {
      const upload = new FormData();
      upload.append("file", file);
      const uploadResponse = await fetch("/api/admin/uploads", { method: "POST", body: upload });
      if (!uploadResponse.ok) {
        setMessage("Nao foi possivel enviar o arquivo.");
        return;
      }
      const uploaded = await uploadResponse.json();
      fileKey = uploaded.fileKey;
    }

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        slug: form.get("slug"),
        shortDescription: form.get("shortDescription"),
        description: form.get("description"),
        priceCents: Number(form.get("priceCents")),
        imageUrl: form.get("imageUrl"),
        fileKey,
        categoryId: form.get("categoryId"),
        status: form.get("status")
      })
    });
    setMessage(response.ok ? "Produto cadastrado." : "Nao foi possivel cadastrar.");
    if (response.ok) window.location.reload();
  }

  return (
    <form className="form" onSubmit={submit}>
      {message ? <div className="notice">{message}</div> : null}
      <label className="field"><span>Nome</span><input className="input" name="name" required /></label>
      <label className="field"><span>Slug</span><input className="input" name="slug" required /></label>
      <label className="field"><span>Descricao curta</span><input className="input" name="shortDescription" required /></label>
      <label className="field"><span>Descricao completa</span><textarea className="textarea" name="description" required /></label>
      <label className="field"><span>Preco em centavos</span><input className="input" name="priceCents" type="number" min={100} required /></label>
      <label className="field"><span>Imagem URL</span><input className="input" name="imageUrl" type="url" required /></label>
      <label className="field"><span>Upload do arquivo digital</span><input className="input" name="file" type="file" /></label>
      <label className="field"><span>Arquivo privado existente</span><input className="input" name="fileKey" placeholder="produto/arquivo.zip" /></label>
      <label className="field">
        <span>Categoria</span>
        <select className="select" name="categoryId" required>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Status</span>
        <select className="select" name="status" defaultValue="ACTIVE">
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </select>
      </label>
      <button className="button full" type="submit">Cadastrar produto</button>
    </form>
  );
}

"use client";

export function AdminOrderStatus({ id, status }: { id: string; status: string }) {
  async function update(value: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value })
    });
    window.location.reload();
  }

  return (
    <select className="select" defaultValue={status} onChange={(event) => update(event.target.value)}>
      <option value="PENDING">Pendente</option>
      <option value="PAID">Pago</option>
      <option value="CANCELED">Cancelado</option>
      <option value="FAILED">Falhou</option>
      <option value="REFUNDED">Reembolsado</option>
    </select>
  );
}

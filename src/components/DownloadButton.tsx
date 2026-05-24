"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export function DownloadButton({
  publicId,
  orderItemId,
  accessToken
}: {
  publicId: string;
  orderItemId: string;
  accessToken?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function download() {
    setLoading(true);
    const response = await fetch(`/api/orders/${publicId}/downloads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderItemId, accessToken })
    });
    setLoading(false);
    if (!response.ok) return;
    const data = await response.json();
    window.location.href = data.url;
  }

  return (
    <button className="button" type="button" onClick={download} disabled={loading}>
      <Download size={18} />
      {loading ? "Gerando..." : "Baixar"}
    </button>
  );
}

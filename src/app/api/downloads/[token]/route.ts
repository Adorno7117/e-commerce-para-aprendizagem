import { NextResponse } from "next/server";
import { consumeDownloadToken } from "@/server/services/download.service";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const download = await consumeDownloadToken(token);
    return new NextResponse(download.file, {
      headers: {
        "Content-Type": download.contentType,
        "Content-Disposition": `attachment; filename="${download.filename}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return Response.json({ error: "Download indisponivel." }, { status: 404 });
  }
}

import { NextRequest } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { assertSameOrigin, publicError } from "@/lib/security";
import { createDownloadToken } from "@/server/services/download.service";

const schema = z.object({
  orderItemId: z.string().min(1),
  accessToken: z.string().optional()
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ publicId: string }> }) {
  try {
    assertSameOrigin(request);
    const session = await readSession();
    const input = schema.parse(await request.json());
    const { publicId } = await params;
    const token = await createDownloadToken({
      publicId,
      orderItemId: input.orderItemId,
      accessToken: input.accessToken,
      session
    });
    return Response.json({ url: `/api/downloads/${token}` });
  } catch (error) {
    return publicError(error instanceof Error ? error.message : undefined, 403);
  }
}

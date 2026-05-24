import { readSession } from "@/lib/auth";

export async function GET() {
  const user = await readSession();
  return Response.json({ user });
}

import { connection } from "next/server";
import { getProof } from "@/lib/proof";

export async function GET() {
  await connection();
  const proof = await getProof();
  return Response.json(proof, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
  });
}

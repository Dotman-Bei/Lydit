import { getBuildInfo } from "@/lib/build";

export function GET() {
  return Response.json(getBuildInfo());
}

import { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/proxy";

export async function GET(
  req: NextRequest,
) {
  return proxyToBackend({
    backendPath:
      `/payments${req.nextUrl.search}`,

    method: "GET",

    req,
  });
}
import { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/proxy";

export async function GET(
  req: NextRequest,
) {
  return proxyToBackend({
    backendPath:
      `/training-requests${req.nextUrl.search}`,

    method: "GET",

    req,
  });
}

export async function POST(
  req: NextRequest,
) {
  return proxyToBackend({
    backendPath:
      "/training-requests",

    method: "POST",

    req,
  });
}
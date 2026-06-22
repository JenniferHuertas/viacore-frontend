import { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/profile/me",
    method: "GET",
    req,
  });
}

export async function PATCH(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/profile/me",
    method: "PATCH",
    req,
  });
}
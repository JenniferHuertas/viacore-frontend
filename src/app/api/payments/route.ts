// src/app/api/payments/route.ts
// GET /payments?startDate=...&endDate=... → solo Admin
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
export async function GET(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/payments",
    method: "GET",
    req,
  });
}
 
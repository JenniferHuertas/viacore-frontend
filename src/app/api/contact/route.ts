// src/app/api/contact/route.ts
// GET /contact → solo Admin (AuthGuard + RolesGuard)
// POST /contact es público — no necesita proxy, el frontend llama directo al backend
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
export async function GET(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/contact",
    method: "GET",
    req,
  });
}
 
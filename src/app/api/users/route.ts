// src/app/api/users/route.ts
// GET /users → solo Admin
// Query params soportados: ?page=1&limit=10
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
export async function GET(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/users",
    method: "GET",
    req,
  });
}
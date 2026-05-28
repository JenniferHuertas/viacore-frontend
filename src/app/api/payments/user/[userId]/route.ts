// src/app/api/payments/user/[userId]/route.ts
// GET /payments/user/:userId → pagos de un usuario
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ userId: string }> };
 
export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await params;
  return proxyToBackend({
    backendPath: `/payments/user/${userId}`,
    method: "GET",
    req,
  });
}
 
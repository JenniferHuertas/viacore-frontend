// src/app/api/payments/[id]/route.ts
// GET /payments/:id → detalle de un pago
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ id: string }> };
 
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend({
    backendPath: `/payments/${id}`,
    method: "GET",
    req,
  });
}
 
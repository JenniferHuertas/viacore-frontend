// src/app/api/notifications/user/[userId]/count/route.ts
// GET /notifications/user/:userId/count → conteo de no leídas
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ userId: string }> };
 
export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await params;
  return proxyToBackend({
    backendPath: `/notifications/user/${userId}/count`,
    method: "GET",
    req,
  });
}
 
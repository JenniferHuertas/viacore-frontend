// src/app/api/notifications/user/[userId]/route.ts
// GET /notifications/user/:userId → todas las notificaciones del usuario
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ userId: string }> };
 
export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await params;
  return proxyToBackend({
    backendPath: `/notifications/user/${userId}`,
    method: "GET",
    req,
  });
}
 
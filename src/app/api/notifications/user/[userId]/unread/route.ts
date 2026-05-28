// src/app/api/notifications/user/[userId]/unread/route.ts
// GET /notifications/user/:userId/unread → notificaciones no leídas
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ userId: string }> };
 
export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await params;
  return proxyToBackend({
    backendPath: `/notifications/user/${userId}/unread`,
    method: "GET",
    req,
  });
}
 
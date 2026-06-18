// src/app/api/notifications/user/[userId]/read-all/route.ts
// PATCH /notifications/user/:userId/read-all → marcar todas como leídas
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ userId: string }> };
 
export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId } = await params;
  return proxyToBackend({
    backendPath: `/notifications/user/${userId}/read-all`,
    method: "PATCH",
    req,
  });
}
 

// src/app/api/notifications/[notificationId]/read/route.ts
// PATCH /notifications/:notificationId/read → marcar una como leída
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ notificationId: string }> };
 
export async function PATCH(req: NextRequest, { params }: Params) {
  const { notificationId } = await params;
  return proxyToBackend({
    backendPath: `/notifications/${notificationId}/read`,
    method: "PATCH",
    req,
  });
}
 

// src/app/api/notifications/[notificationId]/route.ts
// DELETE /notifications/:notificationId → eliminar notificación
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ notificationId: string }> };
 
export async function DELETE(req: NextRequest, { params }: Params) {
  const { notificationId } = await params;
  return proxyToBackend({
    backendPath: `/notifications/${notificationId}`,
    method: "DELETE",
    req,
  });
}
 
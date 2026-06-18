// src/app/api/notifications/route.ts
// POST /notifications → crear notificación
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
export async function POST(req: NextRequest) {
  return proxyToBackend({
    backendPath: "/notifications",
    method: "POST",
    req,
  });
}
 
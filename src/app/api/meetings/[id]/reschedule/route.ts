// src/app/api/meetings/[id]/reschedule/route.ts
// PATCH /meetings/:id/reschedule → reagendar reunión
 
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
 
type Params = { params: Promise<{ id: string }> };
 
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend({
    backendPath: `/meetings/${id}/reschedule`,
    method: "PATCH",
    req,
  });
}
 
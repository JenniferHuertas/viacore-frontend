// src/app/api/training-requests/[id]/upload-evidence/route.ts

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend({
    backendPath: '/training-requests/${params.id}/upload-evidence',
    method: "POST",
    req,
  });
}

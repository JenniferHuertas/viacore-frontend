import { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/proxy";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  req: NextRequest,
  { params }: Params,
) {
  const { id } = await params;

  return proxyToBackend({
    backendPath: `/training-requests/${id}/upload-evidence`,
    method: "POST",
    req,
  });
}
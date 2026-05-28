import { NextRequest } from "next/server";

import { proxyToBackend } from "@/lib/proxy";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  req: NextRequest,
  { params }: Params,
) {
  const { id } = await params;

  return proxyToBackend({
    backendPath: `/trainings/${id}`,

    method: "PATCH",

    req,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: Params,
) {
  const { id } = await params;

  return proxyToBackend({
    backendPath: `/trainings/${id}`,

    method: "DELETE",

    req,
  });
}
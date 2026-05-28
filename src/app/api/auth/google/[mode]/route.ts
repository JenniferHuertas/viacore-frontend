// src/app/api/auth/google/[mode]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mode: string }> }
) {
  const { mode } = await params;
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/${mode}`;
  return NextResponse.redirect(backendUrl);
}

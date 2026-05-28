import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      mode: string;
    };
  },
) {

  const backendUrl =
    `${process.env.NEXT_PUBLIC_API_URL}/auth/google/${params.mode}`;

  return NextResponse.redirect(
    backendUrl,
  );
}
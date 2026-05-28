import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
) {

  try {

    console.log(
      "GOOGLE CALLBACK HIT",
    );

    const searchParams =
      request.nextUrl.searchParams;

    const backendCallback =
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?${searchParams.toString()}`;

    console.log(
      "BACKEND CALLBACK:",
      backendCallback,
    );

    const response =
      await fetch(
        backendCallback,
        {
          method: "GET",
          credentials: "include",
          redirect: "manual",
        },
      );

    console.log(
      "BACKEND STATUS:",
      response.status,
    );

    const cookies =
      response.headers.getSetCookie();

    console.log(
      "COOKIES:",
      cookies,
    );

    const frontendUrl =
      process.env
        .NEXT_PUBLIC_FRONTEND_URL ||
      "https://estudio-via3-frontend.vercel.app";

    const redirectResponse =
      NextResponse.redirect(
        `${frontendUrl}/autenticacion/autenticacion-google`,
      );

    for (const cookie of cookies) {

      redirectResponse.headers.append(
        "set-cookie",
        cookie,
      );
    }

    return redirectResponse;

  } catch (error) {

    console.error(
      "GOOGLE CALLBACK ERROR:",
      error,
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/autenticacion?error=google_callback_failed`,
    );
  }
}

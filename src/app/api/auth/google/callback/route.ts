import { NextResponse } from "next/server";

export async function GET(
  request: Request,
) {

  try {

    const url =
      new URL(request.url);

    const searchParams =
      url.searchParams;

    const backendCallback =
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?${searchParams.toString()}`;

    const response =
      await fetch(
        backendCallback,
        {
          method: "GET",

          redirect: "manual",
        },
      );

    const setCookie =
      response.headers.get(
        "set-cookie",
      );

    const token =
      setCookie
        ?.split("userSession=")[1]
        ?.split(";")[0];

    const frontendUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL ||
      "http://localhost:3000";

    const redirectResponse =
      NextResponse.redirect(
        `${frontendUrl}/autenticacion/autenticacion-google`,
      );

    if (token) {

      redirectResponse.cookies.set(
        "userSession",
        token,
        {
          httpOnly: true,

          secure: true,

          sameSite: "lax",

          path: "/",
        },
      );
    }

    return redirectResponse;

  } catch (error) {

    console.error(
      "GOOGLE CALLBACK PROXY ERROR:",
      error,
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/autenticacion?error=google_callback_failed`,
    );
  }
}
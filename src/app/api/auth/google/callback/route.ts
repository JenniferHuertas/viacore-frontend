import { NextResponse } from "next/server";

export async function GET(
  request: Request,
) {

  try {

    console.log(
      "GOOGLE CALLBACK HIT",
    );

    const url =
      new URL(request.url);

    const searchParams =
      url.searchParams;

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

          redirect: "manual",
        },
      );

    console.log(
      "BACKEND STATUS:",
      response.status,
    );

    const setCookie =
      response.headers.get(
        "set-cookie",
      );

    console.log(
      "SET COOKIE:",
      setCookie,
    );

    const token =
      setCookie
        ?.split("userSession=")[1]
        ?.split(";")[0];

    console.log(
      "TOKEN:",
      token,
    );

    const frontendUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL ||
      "http://localhost:3000";

    const redirectResponse =
      NextResponse.redirect(
        `${frontendUrl}/autenticacion/autenticacion-google`,
      );

    if (token) {

      console.log(
        "SETTING COOKIE IN VERCEL",
      );

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
      "GOOGLE CALLBACK ERROR:",
      error,
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/autenticacion?error=google_callback_failed`,
    );
  }
}

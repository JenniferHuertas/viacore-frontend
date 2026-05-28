import { NextResponse } from "next/server";

export async function POST(
  request: Request,
) {

  try {

    const body =
      await request.json();

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body,
          ),
        },
      );

    const data =
      await response.json();

    if (!response.ok) {

      return NextResponse.json(
        data,
        {
          status:
            response.status,
        },
      );
    }

    // 🔥 obtener cookie backend
    const setCookie =
      response.headers.get(
        "set-cookie",
      );

    const token =
      setCookie
        ?.split("userSession=")[1]
        ?.split(";")[0];

    if (!token) {

      return NextResponse.json(
        {
          message:
            "Token not found",
        },
        {
          status: 401,
        },
      );
    }

    const nextResponse =
      NextResponse.json(data);

    // 🔥 cookie creada por VERCEL
    nextResponse.cookies.set(
      "userSession",
      token,
      {
        httpOnly: true,

        secure: true,

        sameSite: "lax",

        path: "/",
      },
    );

    return nextResponse;

  } catch (error) {

    console.error(
      "SIGNIN PROXY ERROR:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "Internal signin proxy error",
      },
      {
        status: 500,
      },
    );
  }
}
import { cookies } from "next/headers";

export const dynamic =
  "force-dynamic";

export async function GET() {

  try {

    console.log(
      "PROXY PROFILE HIT",
    );

    const cookieStore =
      await cookies();

    const userSession =
      cookieStore.get(
        "userSession",
      );

    console.log(
      "COOKIE FROM NEXT:",
      userSession,
    );

    if (!userSession?.value) {

      console.log(
        "NO COOKIE FOUND",
      );

      return Response.json(
        {
          message:
            "Token not provided",
        },
        {
          status: 401,
        },
      );
    }

    console.log(
      "TOKEN VALUE:",
      userSession.value,
    );

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          method: "GET",

          headers: {
            Cookie:
              `userSession=${userSession.value}`,
          },

          cache: "no-store",
        },
      );

    console.log(
      "BACKEND STATUS:",
      response.status,
    );

    const data =
      await response.json();

    console.log(
      "BACKEND RESPONSE:",
      data,
    );

    return Response.json(
      data,
      {
        status:
          response.status,
      },
    );

  } catch (error) {

    console.error(
      "PROFILE PROXY ERROR:",
      error,
    );

    return Response.json(
      {
        message:
          "Internal proxy error",
      },
      {
        status: 500,
      },
    );
  }
}

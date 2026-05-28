import {
  cookies,
} from "next/headers";

export async function PATCH(
  request: Request,
) {

  try {

    const cookieStore =
      await cookies();

    const userSession =
      cookieStore.get(
        "userSession",
      );

    if (!userSession?.value) {

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

    const body =
      await request.json();

    const response =
      await fetch(
        ${process.env.NEXT_PUBLIC_API_URL}/users/complete-profile,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Cookie:
              userSession=${userSession.value},
          },

          body: JSON.stringify(
            body,
          ),

          cache: "no-store",
        },
      );

    const data =
      await response.json();

    const nextResponse =
      Response.json(
        data,
        {
          status:
            response.status,
        },
      );

    // 🔥 refrescar cookie
    const setCookie =
      response.headers.get(
        "set-cookie",
      );

    if (setCookie) {

      nextResponse.headers.set(
        "set-cookie",
        setCookie,
      );
    }

    return nextResponse;

  } catch (error) {

    console.error(
      "COMPLETE PROFILE PROXY ERROR:",
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

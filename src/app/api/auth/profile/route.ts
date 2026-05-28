import { cookies } from "next/headers";

export async function GET() {

  const cookieStore =
    await cookies();

  const userSession =
    cookieStore.get(
      "userSession",
    );

  const response =
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
      {
        method: "GET",

        headers: {
          Cookie:
            `userSession=${userSession?.value}`,
        },
      },
    );

  const data =
    await response.json();

  return Response.json(
    data,
    {
      status:
        response.status,
    },
  );
}
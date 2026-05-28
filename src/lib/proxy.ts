// src/lib/proxy.ts
 
import { cookies } from "next/headers";
 
import {
  NextRequest,
  NextResponse,
} from "next/server";
 
type ProxyOptions = {
  backendPath: string;
 
  method: string;
 
  req: NextRequest;
};
 
export async function proxyToBackend({
  backendPath,
  method,
  req,
}: ProxyOptions) {
 
  try {
 
    const cookieStore =
      await cookies();
 
    const userSession =
      cookieStore.get(
        "userSession",
      );
 
    const headers =
      new Headers();
 
    // =========================
    // CONTENT TYPE
    // =========================
 
    const contentType =
      req.headers.get(
        "content-type",
      );
 
    if (
      contentType &&
      !contentType.includes(
        "multipart/form-data",
      )
    ) {
 
      headers.set(
        "Content-Type",
        "application/json",
      );
    }
 
    // =========================
    // COOKIE AUTH
    // =========================
 
    if (userSession?.value) {
 
      headers.set(
        "Cookie",
        `userSession=${userSession.value}`,
      );
    }
 
    // =========================
    // BODY
    // =========================
 
    let body:
      | string
      | FormData
      | undefined;
 
    if (
      method !== "GET"
    ) {
 
      if (
        contentType?.includes(
          "multipart/form-data",
        )
      ) {
 
        body =
          await req.formData();
 
      } else {
 
        body =
          await req.text();
      }
    }
 
    // =========================
    // QUERY PARAMS
    // =========================
 
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}${backendPath}`,
    );
 
    req.nextUrl.searchParams.forEach(
      (value, key) => {
        url.searchParams.set(
          key,
          value,
        );
      },
    );
 
    // =========================
    // BACKEND REQUEST
    // =========================
 
    const response =
      await fetch(
        url.toString(),
        {
          method,
 
          headers,
 
          body,
 
          cache:
            "no-store",
        },
      );
 
    // =========================
    // RESPONSE
    // =========================
 
    const responseText =
      await response.text();
 
    let data = null;
 
    try {
 
      data =
        responseText
          ? JSON.parse(
              responseText,
            )
          : null;
 
    } catch {
 
      data =
        responseText;
    }
 
    const nextResponse =
      NextResponse.json(
        data,
        {
          status:
            response.status,
        },
      );
 
    // =========================
    // COPY COOKIES
    // =========================
 
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
      "PROXY ERROR:",
      error,
    );
 
    return NextResponse.json(
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
 
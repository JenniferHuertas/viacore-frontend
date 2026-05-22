import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  role: string;
  profileCompleted: boolean;
  exp: number
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/autenticacion/autenticacion-google") ||
    pathname.startsWith("/auth/google/callback")
  ) {
    return NextResponse.next();
  }

  const protectedRoutes = [
    "/completar-perfil",
    "/mis-solicitudes",
    "/admin",
    "/perfil",
    "/solicitudes",
    "/agenda"
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const token = request.cookies.get("userSession")?.value;

  if (!token) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/autenticacion", request.url));
    }

    return NextResponse.next();
  }

  try {
    const user = jwtDecode<DecodedToken>(token);

    const currentTime = Date.now() / 1000;

       if (user.exp < currentTime) {
      const response = NextResponse.redirect(
        new URL("/autenticacion", request.url)
      );

      response.cookies.delete("userSession");

      return response;
    }

    const isCompleteProfilePage = pathname === "/completar-perfil";

    if (!user.profileCompleted) {
      if (!isCompleteProfilePage) {
        return NextResponse.redirect(
          new URL("/completar-perfil", request.url)
        );
      }
      return NextResponse.next();
    }

    if (pathname === "/autenticacion" || isCompleteProfilePage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
     const response = NextResponse.redirect(
      new URL("/autenticacion", request.url)
    );

   response.cookies.delete("userSession");

    return response;
 }
}
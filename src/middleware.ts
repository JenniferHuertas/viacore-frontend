import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./context/UserContext";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================
  // 🚀 INICIO CAMBIO IMPORTANTE
  // ============================
  // Dejar pasar assets, API y archivos estáticos
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

  const publicRoutes = [
    "/",
    "/autenticacion",
    "/contacto",
    "/plataforma",
    "/capacitaciones",
    "/casos",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
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
    return NextResponse.redirect(new URL("/autenticacion", request.url));
  }
}
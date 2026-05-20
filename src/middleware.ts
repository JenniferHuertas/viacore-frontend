import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./context/UserContext";

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

  // 🚀 Fusionado: Mantiene tu ruta de "/casos" que tu compañero no tenía
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/autenticacion" ||
    pathname === "/contacto" ||
    pathname.startsWith("/plataforma") ||
    pathname.startsWith("/capacitaciones") ||
    pathname.startsWith("/casos");

  const token = request.cookies.get("userSession")?.value;

  if (!token) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/autenticacion", request.url));
  }

  try {
    const user = jwtDecode<DecodedToken>(token);
    const isCompleteProfilePage = pathname === "/completar-perfil";

    if (!user.profileCompleted) {
      if (!isCompleteProfilePage) {
        return NextResponse.redirect(new URL("/completar-perfil", request.url));
      }
      return NextResponse.next();
    }

    // 🚀 Fusionado: Redirección inteligente basada en el rol del usuario
    if (pathname === "/autenticacion" || isCompleteProfilePage) {
      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/admin/requests", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/autenticacion", request.url));
  }
}
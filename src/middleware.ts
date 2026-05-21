import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/autenticacion",
  "/contacto",
];

const PUBLIC_PREFIXES = [
  "/plataforma",
  "/capacitaciones",
  "/casos",
  "/pago",
  "/solicitudes",
  "/mis-solicitudes",
  "/perfil",
  "/completar-perfil",
];

const AUTH_EXCLUDED_ROUTES = [
  "/autenticacion/autenticacion-google",
  "/auth/google/callback",
];

// Rutas que requieren autenticación pero el middleware solo deja pasar
const PROTECTED_PREFIXES = [
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (AUTH_EXCLUDED_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_PREFIXES.some((route) => pathname.startsWith(route));

  const isProtectedRoute = PROTECTED_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );

  const token = request.cookies.get("userSession")?.value;

  // Sin token
  if (!token) {
    if (isPublicRoute) return NextResponse.next();
    // Rutas protegidas sin token → autenticacion
    return NextResponse.redirect(new URL("/autenticacion", request.url));
  }

  // Con token → dejar pasar siempre
  // La validación de rol admin la hace ProtectedRoute en el cliente
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

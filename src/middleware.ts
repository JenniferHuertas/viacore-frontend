import {
  NextRequest,
  NextResponse,
} from "next/server";

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
];

const AUTH_EXCLUDED_ROUTES = [
  "/autenticacion/autenticacion-google",
  "/auth/google/callback",
];

export function middleware(
  request: NextRequest,
) {

  const { pathname } =
    request.nextUrl;

  // Static files

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // OAuth routes

  if (
    AUTH_EXCLUDED_ROUTES.some(
      (route) =>
        pathname.startsWith(
          route,
        ),
    )
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

  const token =
    request.cookies.get(
      "userSession",
    )?.value;

  // Usuario no autenticado

  if (!token) {

    if (isPublicRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL(
        "/autenticacion",
        request.url,
      ),
    );
  }

  // Si hay cookie, dejar pasar.
  // El backend valida JWT real.

  return NextResponse.next();
}

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  isAuthRoute,
  isProtectedRoute,
} from "./route.utils";

export function authMiddleware(
  request: NextRequest,
) {
  const { pathname } =
    request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return null;
  }

  const token =
    request.cookies.get(
      "userSession",
    )?.value;

  const protectedRoute =
    isProtectedRoute(pathname);

  const authRoute =
    isAuthRoute(pathname);

  // Usuario NO autenticado
  // intentando entrar a rutas privadas

  if (
    !token &&
    protectedRoute
  ) {
    return NextResponse.redirect(
      new URL(
        "/autenticacion",
        request.url,
      ),
    );
  }

  // Usuario autenticado
  // intentando volver login

  if (
    token &&
    authRoute &&
    pathname === "/autenticacion"
  ) {
    return NextResponse.redirect(
      new URL(
        "/",
        request.url,
      ),
    );
  }

  return null;
}
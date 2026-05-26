import { NextRequest, NextResponse } from "next/server";

type JwtPayload = {
  profileCompleted?: boolean;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch {
    return null;
  }
}

export function onboardingMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("userSession")?.value;
  if (!token) {
    return null;
  }

  const decoded = parseJwt(token);
  const profileCompleted = decoded?.profileCompleted;
  const publicRoutes = [
    "/autenticacion",
    "/autenticacion/autenticacion-google",
    "/completar-perfil",
    "/api",
    "/_next",
    "/favicon.ico",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const publicAllowedAfterLogin = [
    "/autenticacion",
    "/autenticacion/autenticacion-google",
    "/completar-perfil",
  ];

  const isPublicAllowed = publicAllowedAfterLogin.some((route) =>
    pathname.startsWith(route),
  );

  if (!profileCompleted && !isPublicRoute && !isPublicAllowed) {
    return NextResponse.redirect(new URL("/completar-perfil", request.url));
  }
  return null;
}

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
  console.log("MIDDLEWARE RUN:", request.nextUrl.pathname);

  const { pathname } = request.nextUrl;

  const token = request.cookies.get("userSession")?.value;

  // =========================
  // RUTAS PUBLICAS
  // =========================
  const publicRoutes = [
    "/autenticacion",
    "/autenticacion/autenticacion-google",
    "/completar-perfil",
    "/api",
    "/_next",
    "/favicon.ico",
  ];

  const publicAllowedAfterLogin = [
    "/autenticacion",
    "/autenticacion/autenticacion-google",
    "/completar-perfil",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicAllowed = publicAllowedAfterLogin.some((route) =>
    pathname.startsWith(route),
  );

  // =========================
  // RUTAS PROTEGIDAS (SOLO ESTAS)
  // =========================
  const protectedRoutes = ["/mis-solicitudes"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // =========================
  // 1. PROTEGER SOLO MIS SOLICITUDES
  // =========================
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(
      new URL("/autenticacion", request.url),
    );
  }

  // =========================
  // 2. SI NO HAY TOKEN, DEJAR PASAR TODO LO DEMÁS
  // =========================
  if (!token) {
    return NextResponse.next();
  }

  // =========================
  // 3. ONBOARDING (SOLO LOGUEADOS)
  // =========================
  const decoded = parseJwt(token);
  const profileCompleted = decoded?.profileCompleted;

  if (
    !profileCompleted &&
    !isPublicRoute &&
    !isPublicAllowed
  ) {
    return NextResponse.redirect(
      new URL("/completar-perfil", request.url),
    );
  }

  return NextResponse.next();
}
import {
  NextRequest,
  NextResponse,
} from "next/server";

type JwtPayload = {
  profileCompleted?: boolean;
};

function parseJwt(
  token: string,
): JwtPayload | null {

  try {

    const base64Payload =
      token.split(".")[1];

    const payload =
      JSON.parse(
        atob(base64Payload),
      );

    return payload;

  } catch {

    return null;

  }
}

export function onboardingMiddleware(
  request: NextRequest,
) {

  const { pathname } =
    request.nextUrl;

  const token =
    request.cookies.get(
      "userSession",
    )?.value;

  // Sin sesión no aplica

  if (!token) {
    return null;
  }

  const decoded =
    parseJwt(token);

  const profileCompleted =
    decoded?.profileCompleted;

  const publicRoutes = [
    "/autenticacion",
    "/autenticacion/autenticacion-google",
    "/completar-perfil",
    "/api",
    "/_next",
    "/favicon.ico",
  ];

  const isPublicRoute =
    publicRoutes.some((route) =>
      pathname.startsWith(route),
    );

  const isCompletingProfile =
    pathname.startsWith(
      "/completar-perfil",
    );

  // BLOQUEO TOTAL HASTA COMPLETAR PERFIL

  if (
    !profileCompleted &&
    !isPublicRoute
  ) {

    return NextResponse.redirect(
      new URL(
        "/completar-perfil",
        request.url,
      ),
    );
  }

  // SI YA COMPLETÓ PERFIL
  // NO DEJAR VOLVER

  if (
    profileCompleted &&
    isCompletingProfile
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
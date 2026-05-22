import {
  NextRequest,
  NextResponse,
} from "next/server";

export function onboardingMiddleware(
  request: NextRequest,
) {
  const { pathname } =
    request.nextUrl;

  const token =
    request.cookies.get(
      "userSession",
    )?.value;

  const profileCompleted =
    request.cookies.get(
      "profileCompleted",
    )?.value;

  // Sin sesión no aplica

  if (!token) {
    return null;
  }

  // Solo proteger creación de solicitudes

  const requiresProfile =
    pathname.startsWith(
      "/mis-solicitudes",
    );

  if (
    requiresProfile &&
    profileCompleted !== "true"
  ) {
    return NextResponse.redirect(
      new URL(
        "/completar-perfil",
        request.url,
      ),
    );
  }

  return null;
}
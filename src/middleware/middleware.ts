import { NextRequest, NextResponse } from "next/server";

import { authMiddleware } from "./auth.middleware";

import { onboardingMiddleware } from "./onboarding.middleware";

export function middleware(
  request: NextRequest,
) {
  const authResponse =
    authMiddleware(request);

  if (authResponse) {
    return authResponse;
  }

  const onboardingResponse =
    onboardingMiddleware(request);

  if (onboardingResponse) {
    return onboardingResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
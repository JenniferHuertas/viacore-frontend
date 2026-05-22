import {
  authRoutes,
  protectedRoutes,
} from "./constants";

export const isProtectedRoute = (
  pathname: string,
) => {
  return protectedRoutes.some(
    (route) =>
      pathname.startsWith(route),
  );
};

export const isAuthRoute = (
  pathname: string,
) => {
  return authRoutes.some(
    (route) =>
      pathname.startsWith(route),
  );
};
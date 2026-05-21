"use client";

import {
  useEffect,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useUser } from "@/hooks/useUser";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const router =
    useRouter();

  const pathname =
    usePathname();

  const {
    isHydrated,
    user,
    isAuthenticated,
  } = useUser();

  const isAdminRoute =
    pathname.startsWith(
      "/admin",
    );

  const isAdmin =
    user?.role
      ?.toLowerCase() ===
    "admin";

  useEffect(() => {

    if (!isHydrated) return;

    // Esperar estado real

    if (
      isAdminRoute &&
      isAuthenticated &&
      !isAdmin
    ) {

      router.replace("/");
    }

  }, [
    isHydrated,
    isAdminRoute,
    isAdmin,
    isAuthenticated,
    router,
  ]);

  // Esperar hidratación

  if (!isHydrated) {
    return null;
  }

  // Si es ruta admin y NO está logueado
  // evitar render roto

  if (
    isAdminRoute &&
    !isAuthenticated
  ) {
    return null;
  }

  // Si está logueado pero no es admin

  if (
    isAdminRoute &&
    isAuthenticated &&
    !isAdmin
  ) {
    return null;
  }

  return <>{children}</>;
}

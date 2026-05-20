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

    if (
      isAdminRoute &&
      !isAdmin
    ) {

      router.replace("/");
    }

  }, [
    isHydrated,
    isAdminRoute,
    isAdmin,
    router,
  ]);

  if (!isHydrated) {
    return null;
  }

  if (
    isAdminRoute &&
    !isAdmin
  ) {
    return null;
  }

  return <>{children}</>;
}
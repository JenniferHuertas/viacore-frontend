"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isHydrated, user, isAuthenticated } = useUser();

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdmin = user?.role?.toLowerCase() === "admin";

  console.log("🔍 ProtectedRoute:", {
    pathname,
    isHydrated,
    isAuthenticated,
    isAdminRoute,
    isAdmin,
    userRole: user?.role,
  });

  useEffect(() => {
    if (!isHydrated) return;

    console.log("⚡ useEffect disparado:", {
      isAdminRoute,
      isAuthenticated,
      isAdmin,
    });

    if (isAdminRoute && !isAuthenticated) {
      console.log("❌ Redirigiendo: no autenticado");
      router.replace("/autenticacion");
    }

    if (isAdminRoute && isAuthenticated && !isAdmin) {
      console.log("❌ Redirigiendo: no es admin");
      router.replace("/");
    }
  }, [isHydrated, isAdminRoute, isAdmin, isAuthenticated, router]);

  if (!isHydrated) return null;
  if (isAdminRoute && !isAuthenticated) return null;
  if (isAdminRoute && isAuthenticated && !isAdmin) return null;

  return <>{children}</>;
}

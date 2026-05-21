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

  useEffect(() => {
    if (!isHydrated) return;

    if (isAdminRoute && !isAuthenticated) {
      router.replace("/auth/login"); // o la ruta que uses
    }

    if (isAdminRoute && isAuthenticated && !isAdmin) {
      router.replace("/");
    }
  }, [isHydrated, isAdminRoute, isAdmin, isAuthenticated, router]);

  // Esperar hidratación siempre
  if (!isHydrated) return null;

  // Redirigiendo — no renderizar nada todavía
  if (isAdminRoute && !isAuthenticated) return null;
  if (isAdminRoute && isAuthenticated && !isAdmin) return null;

  return <>{children}</>;
}

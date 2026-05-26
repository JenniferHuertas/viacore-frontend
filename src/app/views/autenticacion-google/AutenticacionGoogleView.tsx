"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUserContext } from "@/context/UserContext";

export default function AutenticacionGoogleView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useUserContext();

  const executed = useRef(false);

  useEffect(() => {
    if (executed.current) return;
    executed.current = true;

    const error = searchParams.get("error");

    // =========================
    // ERRORES
    // =========================
    if (error) {
      toast.error("Error en login con Google");

      setTimeout(() => {
        router.replace("/autenticacion");
      }, 100);

      return;
    }

    const init = async () => {
      try {
        await new Promise((res) => setTimeout(res, 150));
        const profile = await refreshUser();

        if (!profile) {
          toast.error("El correo ingresado ya existe");
          router.replace("/autenticacion");
          return;
        }

        toast.success("Login con Google exitoso");

        // =========================
        // RETURN TO (SOLO SESSION STORAGE)
        // =========================
        const returnTo = sessionStorage.getItem("googleReturnTo") || "/";
        sessionStorage.removeItem("googleReturnTo");
        if (!profile.profileCompleted && profile.role !== "Admin") {
          router.replace("/completar-perfil");
          return;
        }

        // =========================
        // REDIRECCIÓN FINAL
        // =========================
        router.replace(returnTo);
      } catch {
        toast.error("Error en login con Google");
        router.replace("/autenticacion");
      }
    };

    init();
  }, [router, refreshUser, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Iniciando sesión...
    </div>
  );
}

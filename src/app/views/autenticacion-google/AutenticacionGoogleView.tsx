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
    // ERROR OAUTH REAL
    // =========================
    if (error) {
      toast.error("Error en autenticación con Google");
      router.replace("/autenticacion");
      return;
    }

    const init = async () => {
      try {
        // 🔥 Brave tarda más en persistir cookies cross-site
        await new Promise((res) => setTimeout(res, 1200));

        let profile = await refreshUser();

        // 🔥 segundo intento REAL
        if (!profile) {
          await new Promise((res) => setTimeout(res, 1000));
          profile = await refreshUser();
        }

        // =========================
        // MODE
        // =========================
        const mode =
          sessionStorage.getItem("googleMode") ||
          searchParams.get("state") ||
          "signin";

        // =========================
        // RETURN ROUTE
        // =========================
        const returnTo = sessionStorage.getItem("googleReturnTo") || "/";

        sessionStorage.removeItem("googleMode");
        sessionStorage.removeItem("googleReturnTo");

        // =========================
        // ERROR USUARIO
        // =========================
        if (!profile) {
          toast.error("No se pudo validar la sesion Google");
          router.replace("/autenticacion");
          return;
        }

        // =========================
        // ONBOARDING
        // =========================
        if (!profile.profileCompleted && profile.role !== "Admin") {
          sessionStorage.setItem("googleReturnTo", returnTo);
          router.replace("/completar-perfil");
          return;
        }

        // =========================
        // LOGIN OK
        // =========================
        toast.success(
          mode === "signup"
            ? "Cuenta creada e inicio de sesion exitoso"
            : "Inicio de sesion exitoso"
        );

        router.replace(returnTo);
      } catch (err) {
        console.error(err);
        toast.error("Error en login con Google");
        router.replace("/autenticacion");
      }
    };

    init();
  }, [router, refreshUser, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Iniciando sesion...
    </div>
  );
}
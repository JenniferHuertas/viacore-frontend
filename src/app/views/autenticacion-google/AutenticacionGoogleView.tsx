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
        await new Promise((res) => setTimeout(res, 150));

        const profile = await refreshUser();

        // =========================
        // MODE (signin / signup)
        // =========================
        const mode =
          sessionStorage.getItem("googleMode") ||
          searchParams.get("state") ||
          "signin";

        // =========================
        // RETURN ROUTE
        // =========================
        const returnTo =
          sessionStorage.getItem("googleReturnTo") || "/";

        // limpiar storage base
        sessionStorage.removeItem("googleMode");
        sessionStorage.removeItem("googleReturnTo");

        // =========================
        // ERROR DE USUARIO
        // =========================
        if (!profile) {
          if (mode === "signup") {
            toast.error("Este correo ya existe, inicia sesión");
          } else {
            toast.error("No existe una cuenta con este correo");
          }

          router.replace("/autenticacion");
          return;
        }

        // =========================
        // ONBOARDING (COMPLETAR PERFIL)
        // =========================
        if (!profile.profileCompleted && profile.role !== "Admin") {
          // 🔥 IMPORTANTE: no crear nuevas keys raras
          sessionStorage.setItem("googleReturnTo", returnTo);

          router.replace("/completar-perfil");
          return;
        }

        // =========================
        // LOGIN EXITOSO
        // =========================
        toast.success(
          mode === "signup"
            ? "Cuenta creada e inicio de sesión exitoso"
            : "Inicio de sesión exitoso"
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
      Iniciando sesión...
    </div>
  );
}
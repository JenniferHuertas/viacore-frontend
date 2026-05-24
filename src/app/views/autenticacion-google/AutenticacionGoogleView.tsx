"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { toast } from "sonner";

import { useUserContext } from "@/context/UserContext";

export default function AutenticacionGoogleView() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const {
    refreshUser,
  } = useUserContext();

  const executed =
    useRef(false);

  useEffect(() => {

    if (executed.current) {
      return;
    }

    executed.current = true;

    const error =
      searchParams.get("error");

    // ERRORES OAUTH

    if (error) {

      if (
        error ===
        "google_manual_conflict"
      ) {

        toast.error(
          "Este correo ya fue registrado con email y contraseña.",
        );

      } else if (
        error ===
        "google_not_registered"
      ) {

        toast.error(
          "Todavía no tenés una cuenta creada con Google. Registrate primero.",
        );

      } else if (
        error ===
        "google_already_exists"
      ) {

        toast.error(
          "Ya existe una cuenta registrada con Google para este correo. Inicia sesión.",
        );

      } else if (
        error ===
        "google_auth_failed"
      ) {

        // ESTE ERA EL TOAST
        // QUE TE SEGUÍA APARECIENDO

        toast.error(
          "No existe una cuenta Google registrada con este correo.",
        );

      } else if (
        error ===
        "google_token_missing"
      ) {

        toast.error(
          "No pudimos generar la sesión con Google.",
        );

      } else {

        toast.error(
          "Ocurrió un error durante el inicio de sesión con Google.",
        );
      }

      setTimeout(() => {

        router.replace(
          "/autenticacion",
        );

      }, 100);

      return;
    }

    const init =
      async () => {

        try {

          const profile =
            await refreshUser();

          if (!profile) {

            toast.error(
              "No existe una cuenta Google registrada con este correo.",
            );

            router.replace(
              "/autenticacion",
            );

            return;
          }

          toast.success(
            "Login con Google exitoso",
          );

          // ONBOARDING OBLIGATORIO

          if (
            !profile.profileCompleted &&
            profile.role !== "Admin"
          ) {

            router.replace(
              "/completar-perfil",
            );

            return;
          }

          router.replace("/");

        } catch {

          toast.error(
            "No existe una cuenta Google registrada con este correo.",
          );

          router.replace(
            "/autenticacion",
          );
        }
      };

    init();

  }, [
    router,
    refreshUser,
    searchParams,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Iniciando sesión...
    </div>
  );
}
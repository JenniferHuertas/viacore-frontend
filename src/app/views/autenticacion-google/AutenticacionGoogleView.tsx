"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

import { useUserContext } from "@/context/UserContext";

export default function AutenticacionGoogleView() {

  const router =
    useRouter();

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

    const init =
      async () => {

        const profile =
          await refreshUser();

        if (!profile) {

          router.replace(
            "/autenticacion",
          );

          return;
        }

        toast.success(
          "Autenticación con Google exitosa",
        );

        if (
          !profile.profileCompleted
        ) {

          router.replace(
            "/completar-perfil",
          );

          return;
        }

        router.replace("/");

      };

    init();

  }, [
    router,
    refreshUser,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Iniciando sesión...
    </div>
  );
}

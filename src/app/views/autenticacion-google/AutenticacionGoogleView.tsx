"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

import { useUserContext } from "@/context/UserContext";

export default function AutenticacionGoogleView() {

  const router = useRouter();

  const {
    refreshUser,
    user,
  } = useUserContext();

  useEffect(() => {

    const init =
      async () => {

        await refreshUser();

      };

    init();

  }, [refreshUser]);

  useEffect(() => {

    if (!user) {
      return;
    }

    toast.success(
      "Autenticación con Google exitosa",
    );

    if (!user.profileCompleted) {

      router.replace(
        "/completar-perfil",
      );

      return;
    }

    router.replace("/");

  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Iniciando sesión...
    </div>
  );
}

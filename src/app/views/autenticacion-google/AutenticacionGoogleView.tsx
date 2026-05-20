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
  } = useUserContext();

  useEffect(() => {

    const init =
      async () => {

        await refreshUser();

        toast.success(
          "Autenticación con Google exitosa",
        );

        router.push("/");
      };

    init();

  }, [router, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Iniciando sesión...
    </div>
  );
}
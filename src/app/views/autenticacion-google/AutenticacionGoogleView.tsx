"use client";

import {
  useEffect,
  useRef,
  useState,
  Suspense, // 1. Importamos Suspense
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useUser } from "@/hooks/useUser";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

type DecodedToken = {
  id: string;
  email: string;
  role: string;
  profileCompleted: boolean;
};
function GoogleAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const hasLogged = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (hasLogged.current) return;

    try {
      const token = searchParams.get("token");
      const isLogin = searchParams.get("login");

      if (!token) {
        toast.error("Error al autenticar con Google");
        router.push("/autenticacion");
        return;
      }

      hasLogged.current = true;
      const decoded = jwtDecode<DecodedToken>(token);
      login(token);

      if (isLogin === "true") {
        toast.success("Sesión iniciada con Google");
      } else {
        toast.success("Cuenta creada con Google");
      }

      if (!decoded.profileCompleted) {
        router.push("/completar-perfil");
        return;
      }

      router.push("/");
    } catch {
      toast.error("Error al autenticar con Google");
      router.push("/autenticacion");
    }
  }, [mounted, searchParams, login, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Iniciando sesión...
    </div>
  );
}

export default function AutenticacionGoogleView() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          Cargando componentes de seguridad...
        </div>
      }
    >
      <GoogleAuthContent />
    </Suspense>
  );
}
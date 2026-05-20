"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import GoogleButton from "./GoogleButton";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { loginUser } from "@/services/auth.service";
import { loginSchema } from "@/validations/login.validations";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginFormProps = {
  onSwitchToRegister: () => void;
};

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await loginUser(data);
      const token = res.access_token;

      login(token);
      toast.success("Login exitoso");
      document.cookie = `userSession=${token}; path=/; max-age=604800; SameSite=Lax`;

      const returnTo = searchParams.get("returnTo");
      const pending = localStorage.getItem("pendingRequest");

      if (returnTo) {
        router.push(returnTo);
      } else if (pending) {
        const { trainingId, categoria } = JSON.parse(pending);
        localStorage.removeItem("pendingRequest");
        router.push(`/solicitudes?categoria=${encodeURIComponent(categoria)}&trainingId=${trainingId}`);
      } else {
        router.push("/");
      }
    } catch {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
   <form
  onSubmit={handleSubmit(
    onSubmit,
    (errors) => {
      const hasEmptyFields = Object.values(errors).some(
        (error) =>
          error?.message === "El email es obligatorio" ||
          error?.message === "La contraseña es obligatoria"
      );

      if (hasEmptyFields) {
        toast.warning("Debes completar todos los campos");
      }
    }
  )}
  noValidate
  className="space-y-5"
>
      <GoogleButton />

      <div className="text-center text-gray-500">o</div>

      <div>
        <Input
          type="email"
          placeholder="Correo electrónico"
          {...register("email")}
        />
     {touchedFields.email && errors.email?.message && (
  <p className="text-red-500 text-xs mt-1">
    {String(errors.email.message)}
  </p>
)}
      </div>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3 text-gray-400 hover:text-[#C7962D] transition cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
       {touchedFields.password && errors.password?.message && (
  <p className="text-red-500 text-xs mt-1">
    {String(errors.password.message)}
  </p>
)}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
          <input type="checkbox" className="accent-[#C7962D]" />
          Recordarme
        </label>
        <span className="text-[#C7962D] cursor-pointer hover:underline">
          ¿Olvidaste tu contraseña?
        </span>
      </div>

      <Button
        type="submit"
        className="w-full"
      >
        Acceder
      </Button>

      <p className="text-sm text-gray-400 text-center">
        ¿No tenés cuenta?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-[#C7962D] hover:underline cursor-pointer"
        >
          Registrate
        </button>
      </p>
    </form>
  );
}
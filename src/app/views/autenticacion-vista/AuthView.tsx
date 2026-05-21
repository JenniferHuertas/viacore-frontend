"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import GoogleButton from "@/components/auth/GoogleButton";

import Input from "@/components/ui/Input";

import Button from "@/components/ui/Button";

import { loginUser } from "@/services/auth.service";

import { loginSchema } from "@/validations/login.validations";

import { useUser } from "@/hooks/useUser";

type LoginFormProps = {
  onSwitchToRegister: () => void;
};

type LoginFormData = {
  email: string;

  password: string;
};

export default function LoginForm({
  onSwitchToRegister,
}: LoginFormProps) {

  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const { login } =
    useUser();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors,
      isValid,
    },
  } = useForm<LoginFormData>({
    resolver:
      zodResolver(
        loginSchema,
      ),

    mode: "onChange",
  });

  const email =
    watch("email");

  const password =
    watch("password");

  const isDisabled =
    !email ||
    !password ||
    !isValid ||
    loading;

  useEffect(() => {

    const savedEmail =
      localStorage.getItem(
        "rememberEmail",
      );

    if (savedEmail) {

      setValue(
        "email",
        savedEmail,
      );

      setRememberMe(true);
    }

  }, [setValue]);

  const onSubmit = async (
    data: LoginFormData,
  ) => {

    try {

      setLoading(true);

      await loginUser(
        data,
      );

      await login();

      try {

        if (rememberMe) {

          localStorage.setItem(
            "rememberEmail",
            data.email,
          );

        } else {

          localStorage.removeItem(
            "rememberEmail",
          );
        }

      } catch (error) {

        console.error(
          "Error saving remember email",
          error,
        );
      }

      toast.success(
        "Login exitoso",
      );

      const returnTo =
        searchParams.get(
          "returnTo",
        );

      const pending =
        localStorage.getItem(
          "pendingRequest",
        );

      if (returnTo) {

        router.replace(
          returnTo,
        );

        return;
      }

      if (pending) {

        const {
          trainingId,
          categoria,
        } = JSON.parse(
          pending,
        );

        localStorage.removeItem(
          "pendingRequest",
        );

        router.replace(
          `/solicitudes?categoria=${encodeURIComponent(
            categoria,
          )}&trainingId=${trainingId}`,
        );

        return;
      }

      router.replace("/");

    } catch (error) {

      console.error(error);

      toast.error(
        "Credenciales incorrectas",
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
      )}
      noValidate
      autoComplete="off"
      className="space-y-5"
    >

      <GoogleButton />

      <div className="text-center text-gray-500">
        o
      </div>

      <div>

        <Input
          type="email"
          placeholder="Correo electrónico"
          autoComplete="off"
          {...register("email")}
        />

        {errors.email
          ?.message && (

          <p className="text-red-400 text-xs mt-1">
            {String(
              errors.email
                .message,
            )}
          </p>

        )}

      </div>

      <div className="relative">

        <Input
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Contraseña"
          autoComplete="new-password"
          {...register(
            "password",
          )}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword,
            )
          }
          className="absolute right-4 top-3 text-gray-400 hover:text-[#C7962D] transition cursor-pointer"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

        {errors.password
          ?.message && (

          <p className="text-red-400 text-xs mt-1">
            {String(
              errors.password
                .message,
            )}
          </p>

        )}

      </div>

      <div className="flex items-center justify-between text-sm">

        <label className="flex items-center gap-2 text-gray-400 cursor-pointer">

          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) =>
              setRememberMe(
                e.target.checked,
              )
            }
            className="accent-[#C7962D]"
          />

          Recordarme

        </label>

        <span className="text-[#C7962D] cursor-pointer hover:underline">
          ¿Olvidaste tu contraseña?
        </span>

      </div>

      <Button
        type="submit"
        disabled={
          isDisabled
        }
        className={`w-full transition ${
          isDisabled
            ? "opacity-20 cursor-not-allowed"
            : ""
        }`}
      >
        {loading
          ? "Ingresando..."
          : "Acceder"}
      </Button>

      <p className="text-sm text-gray-400 text-center">

        ¿No tenés cuenta?{" "}

        <button
          type="button"
          onClick={
            onSwitchToRegister
          }
          className="text-[#C7962D] hover:underline cursor-pointer"
        >
          Registrate
        </button>

      </p>

    </form>
  );
}

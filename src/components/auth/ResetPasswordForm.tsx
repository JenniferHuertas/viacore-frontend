"use client";

import { useSearchParams } from "next/navigation";

import { toast } from "sonner";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
} from "../../validations/resset.password.validations";

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {

  const searchParams =
    useSearchParams();

  const email =
    searchParams.get("email");

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
      touchedFields,
    },
  } = useForm<FormData>({
    resolver:
      zodResolver(
        resetPasswordSchema,
      ),

    mode: "onBlur",

    reValidateMode:
      "onBlur",

    shouldUnregister: false,
  });

  const password =
    watch("password");

  const confirmPassword =
    watch("confirmPassword");

  const handleEmptySubmitToast =
    () => {

      const hasEmpty =
        !password ||
        !confirmPassword;

      if (hasEmpty) {

        toast.warning(
          "Debes completar todos los campos",
        );
      }
    };

  const onSubmit =
    async (
      data: FormData,
    ) => {

      

      if (!email) {

        toast.error(
          "Correo inválido.",
        );

        return;
      }

      try {

        const res =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email,
                password:
                  data.password,
              }),
            },
          );

        if (!res.ok) {

          const data =
            await res
              .json()
              .catch(
                () => null,
              );

          throw new Error(
            data?.message ||
              "Error",
          );
        }

        toast.success(
          "Contraseña actualizada correctamente",
        );

      } catch (error: any) {

        toast.error(
          error?.message ||
            "No se pudo actualizar la contraseña",
        );
      }
    };

  const onInvalid =
    () => {};

  return (
    <form
      onSubmit={(e) => {

        handleEmptySubmitToast();

        handleSubmit(
          onSubmit,
          onInvalid,
        )(e);
      }}
      className="
        w-full
        max-w-md
        rounded-2xl
        border
        border-white/10
        bg-[#111315]
        p-8
        shadow-2xl
      "
    >

      <h1 className="text-2xl font-semibold text-white mb-2">
        Nueva contraseña
      </h1>

      <p className="text-white/60 text-sm mb-6">
        Ingresa tu nueva contraseña.
      </p>

      <div className="space-y-4">

        <div>

          <input
            type="password"
            placeholder="Nueva contraseña"
            {...register(
              "password",
            )}
            className="
              w-full
              rounded-lg
              bg-black/40
              border
              border-white/10
              px-4
              py-3
              text-white
              outline-none
              focus:border-white/30
            "
          />

          {errors.password &&
            touchedFields.password && (
              <p className="text-red-400 text-sm mt-1">
                {
                  errors.password
                    .message
                }
              </p>
            )}

        </div>

        <div>

          <input
            type="password"
            placeholder="Confirmar contraseña"
            {...register(
              "confirmPassword",
            )}
            className="
              w-full
              rounded-lg
              bg-black/40
              border
              border-white/10
              px-4
              py-3
              text-white
              outline-none
              focus:border-white/30
            "
          />

          {errors.confirmPassword &&
            touchedFields.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {
                  errors
                    .confirmPassword
                    .message
                }
              </p>
            )}

        </div>

        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="
            w-full
            rounded-lg
            text-black
            py-3
            font-medium
            bg-linear-to-r
            from-[#C7962D]
            to-[#E0B84F]
            hover:brightness-110
            transition-all
            disabled:opacity-50
            cursor-pointer
          "
        >

          {isSubmitting
            ? "Actualizando..."
            : "Cambiar contraseña"}

        </button>

      </div>

    </form>
  );
}
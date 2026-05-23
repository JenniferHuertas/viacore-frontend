"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { toast } from "sonner";

export default function ResetPasswordForm() {

  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {

    if (!password || !confirmPassword) {

      toast.warning(
        "Debes completar todos los campos",
      );

      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success(
        "Contraseña actualizada correctamente",
      );

    } catch (error) {

      toast.error(
        "No se pudo actualizar la contraseña",
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111315] p-8 shadow-2xl">

      <h1 className="text-2xl font-semibold text-white mb-2">
        Nueva contraseña
      </h1>

      <p className="text-white/60 text-sm mb-6">
        Ingresa tu nueva contraseña.
      </p>

      <div className="space-y-4">

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value,
            )
          }
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value,
            )
          }
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg text-black py-3 font-medium bg-linear-to-r from-[#C7962D] to-[#E0B84F]
          transition-all duration-200
          hover:brightness-110
          hover:shadow-lg hover:shadow-[#C7962D]/20
          disabled:opacity-50
          cursor-pointer"
        >
          {loading
            ? "Actualizando..."
            : "Cambiar contraseña"}
        </button>

      </div>

    </div>
  );
}
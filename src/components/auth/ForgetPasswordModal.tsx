"use client";

import { toast } from "sonner";
import { forgotPasswordSchema } from "@/validations/forget.password.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ForgetPasswordModalProps = {
  onClose: () => void;
};

type ForgotPasswordData = {
  email: string;
};

export default function ForgetPasswordModal({
  onClose,
}: ForgetPasswordModalProps) {

  const {
  register,
  handleSubmit,
  getValues,
  formState: { errors, touchedFields },
} = useForm<ForgotPasswordData>({
  resolver: zodResolver(forgotPasswordSchema),
  mode: "onBlur",
});

const handleSend = () => {
  const email = getValues("email");

  if (!email) {
    toast.warning("Debes ingresar tu email");
    return;
  }

  handleSubmit(onSubmit)();
};

const onSubmit = async (data: ForgotPasswordData) => {
  try {
       const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Error en la solicitud");
    }

    toast.success("Email enviado con éxito, abrilo y seguí los pasos");
    onClose(); 
  } catch (error) {
    toast.error("Error al enviar el email. Intenta nuevamente");
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0D0F] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-white text-lg font-semibold">
            Recuperar contraseña
          </h2>

          <button
          type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white cursor-pointer text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-white/60 text-sm">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <input
            type="email"
            placeholder="Tu email"
            {...register("email")}
            className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
          />

          {touchedFields.email && errors.email?.message && (
  <p className="text-red-400 text-xs mt-1">
    {errors.email.message}
  </p>
)}

          <button
            onClick={handleSend}
            className="w-full rounded-lg text-black py-3 font-medium bg-linear-to-r from-[#C7962D] to-[#E0B84F]

        transition-all duration-200

        hover:brightness-110
        hover:shadow-lg hover:shadow-[#C7962D]/20 cursor-pointer"
          >
            Enviar enlace
          </button>
        </div>
      </div>
    </div>
  );
}
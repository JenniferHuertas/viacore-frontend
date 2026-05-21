"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import GoogleButton from "./GoogleButton";

import Input from "@/components/ui/Input";

import Button from "@/components/ui/Button";

import TermsModal from "./TermsModal";

import {
  registerUser,
  loginUser,
} from "@/services/auth.service";

import { registerSchema } from "@/validations/register.validations";

import { toast } from "sonner";

import { useUser } from "@/hooks/useUser";

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export default function RegisterForm({
  onSwitchToLogin,
}: RegisterFormProps) {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const { login } =
    useUser();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    showTermsModal,
    setShowTermsModal,
  ] = useState(false);

  const [errors, setErrors] =
    useState<Record<string, string>>(
      {},
    );

  const [touched, setTouched] =
    useState<Record<string, boolean>>(
      {},
    );

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      phone: "",
      country: "",
      companyName: "",
      acceptedTerms: false,
    });

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {

    const { name } =
      e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {

    const { name, value } =
      e.target;

    const updatedValues = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedValues);

    const result =
      registerSchema.safeParse(
        updatedValues,
      );

    if (!result.success) {

      const fieldErrors:
        Record<string, string> = {};

      result.error.issues.forEach(
        (issue) => {

          const field =
            issue.path[0] as string;

          if (!fieldErrors[field]) {

            fieldErrors[field] =
              issue.message;
          }
        },
      );

      setErrors(fieldErrors);

    } else {

      setErrors({});
    }
  };

  const handleSubmit =
    async (e: any) => {

      e.preventDefault();

      const result =
        registerSchema.safeParse(
          formData,
        );

      if (!result.success) {

        const fieldErrors:
          Record<string, string> = {};

        result.error.issues.forEach(
          (issue) => {

            const field =
              issue.path[0] as string;

            if (!fieldErrors[field]) {

              fieldErrors[field] =
                issue.message;
            }
          },
        );

        setErrors(fieldErrors);

        toast.warning(
          "Debes completar todos los campos y aceptar los términos y condiciones",
        );

        return;
      }

      try {

        const userData = {
          ...result.data,
        };

        delete (userData as any)
          .acceptedTerms;

        await registerUser(
          userData,
        );

        toast.success(
          "Cuenta creada. Iniciando sesión automáticamente...",
        );

        await loginUser({
          email:
            result.data.email,

          password:
            result.data.password,
        });

        // NO usar document.cookie
        // El backend ya maneja
        // la cookie httpOnly

        await login();

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

        router.replace(
          "/plataforma",
        );

      } catch (err: any) {

        const mensajeBackend =
          err?.message ||
          "Error al registrarse";

        toast.error(
          mensajeBackend,
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

  return (
    <>
      <form
        onSubmit={
          handleSubmit
        }
        noValidate
        className="space-y-5"
      >

        <GoogleButton />

        <div className="text-center text-gray-500">
          o
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-2">

            <Input
              name="name"
              type="text"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {touched.name &&
              errors.name && (

              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>

            )}

          </div>

          <div className="col-span-2">

            <Input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {touched.email &&
              errors.email && (

              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>

            )}

          </div>

          <div className="col-span-2">

            <div className="relative">

              <Input
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
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

            </div>

            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Mínimo 8 caracteres,
              incluyendo mayúscula,
              minúscula, número y
              carácter especial.
            </p>

            {touched.password &&
              errors.password && (

              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>

            )}

          </div>

          <div className="col-span-2">

            <div className="relative">

              <Input
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirmar contraseña"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword,
                  )
                }
                className="absolute right-4 top-3 text-gray-400 hover:text-[#C7962D] transition cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            <p className="mt-2 text-xs text-gray-500">
              Repetí la contraseña
            </p>

            {touched.confirmPassword &&
              errors.confirmPassword && (

              <p className="text-red-500 text-xs mt-1">
                {
                  errors.confirmPassword
                }
              </p>

            )}

          </div>

          <div>
            <Input
              name="address"
              type="text"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <p className="mt-2 text-xs text-gray-500">
              Dirección de la empresa
            </p>

            {touched.address &&
              errors.address && (

              <p className="text-red-500 text-xs mt-1">
                {errors.address}
              </p>

            )}

          </div>

          <div>
            <Input
              name="phone"
              type="tel"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <p className="mt-2 text-xs text-gray-500">
              Número de contacto
            </p>

            {touched.phone &&
              errors.phone && (

              <p className="text-red-500 text-xs mt-1">
                {errors.phone}
              </p>

            )}

          </div>

          <div>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C7962D]"
            >
              <option value="" disabled>
                🌍 Seleccionar país
              </option>

              <option value="Argentina">
                🇦🇷 Argentina
              </option>

              <option value="Brasil">
                🇧🇷 Brasil
              </option>

              <option value="Chile">
                🇨🇱 Chile
              </option>

              <option value="Colombia">
                🇨🇴 Colombia
              </option>

              <option value="España">
                🇪🇸 España
              </option>

              <option value="Estados Unidos">
                🇺🇸 Estados Unidos
              </option>

              <option value="México">
                🇲🇽 México
              </option>

              <option value="Perú">
                🇵🇪 Perú
              </option>

              <option value="Uruguay">
                🇺🇾 Uruguay
              </option>
            </select>

            <p className="mt-2 text-xs text-gray-500">
              País donde opera la empresa
            </p>

            {touched.country &&
              errors.country && (

              <p className="text-red-500 text-xs mt-1">
                {errors.country}
              </p>

            )}

          </div>

          <div>
            <Input
              name="city"
              type="text"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <p className="mt-2 text-xs text-gray-500">
              Ciudad principal
            </p>

            {touched.city &&
              errors.city && (

              <p className="text-red-500 text-xs mt-1">
                {errors.city}
              </p>

            )}

          </div>

          <div className="col-span-2">
            <Input
              name="companyName"
              type="text"
              placeholder="Empresa"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <p className="mt-2 text-xs text-gray-500">
              Nombre de la empresa o institución
            </p>

            {touched.companyName &&
              errors.companyName && (

              <p className="text-red-500 text-xs mt-1">
                {errors.companyName}
              </p>

            )}

          </div>

        </div>

        <div className="flex items-start gap-3 text-sm text-gray-400">

          <button
            type="button"
            onClick={() => {

              setTouched((prev) => ({
                ...prev,
                acceptedTerms: true,
              }));

              setShowTermsModal(true);
            }}
            className="mt-1 h-4 w-4 rounded border border-white/20 flex items-center justify-center bg-[#0D0D0D] transition hover:border-[#C7962D] cursor-pointer"
          >

            {formData.acceptedTerms && (

              <div className="h-2 w-2 rounded-sm bg-[#C7962D]" />

            )}

          </button>

          <span className="leading-relaxed">

            Acepto los{" "}

            <button
              type="button"
              onClick={() => {

                setTouched((prev) => ({
                  ...prev,
                  acceptedTerms: true,
                }));

                setShowTermsModal(true);
              }}
              className="text-[#C7962D] hover:underline cursor-pointer"
            >
              Términos y Condiciones
            </button>

          </span>

        </div>

        {touched.acceptedTerms &&
          errors.acceptedTerms && (

          <p className="text-red-500 text-xs mt-1">
            {errors.acceptedTerms}
          </p>

        )}

        <Button
          type="submit"
          className="w-full"
        >
          Crear cuenta
        </Button>

        <p className="text-sm text-gray-400 text-center">

          ¿Ya tenés cuenta?{" "}

          <button
            type="button"
            onClick={
              onSwitchToLogin
            }
            className="text-[#C7962D] hover:underline cursor-pointer"
          >
            Iniciar sesión
          </button>

        </p>

      </form>

      {showTermsModal && (

        <TermsModal
          onAccept={() => {

            setFormData(
              (prev) => ({
                ...prev,
                acceptedTerms: true,
              }),
            );

            setErrors(
              (prev) => ({
                ...prev,
                acceptedTerms: "",
              }),
            );

            setShowTermsModal(
              false,
            );
          }}

          onClose={() => {

            setFormData(
              (prev) => ({
                ...prev,
                acceptedTerms: false,
              }),
            );

            setShowTermsModal(
              false,
            );
          }}
        />

      )}
    </>
  );
}

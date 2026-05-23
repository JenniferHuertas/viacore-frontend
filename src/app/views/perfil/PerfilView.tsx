"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import Input from "@/components/ui/Input";

import Button from "@/components/ui/Button";

import {
  getMyProfile,
  updateMyProfile,
} from "@/services/profile.service";

import { profileSchema } from "@/validations/profile.validations";

type ProfileFormData = {
  name: string;
  phone: string;
  country: string;
  companyName: string;
  city: string;
  address: string;
};

export default function PerfilView() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: {
      errors,
      dirtyFields,
    },
  } = useForm<ProfileFormData>({
    resolver:
      zodResolver(
        profileSchema,
      ),

    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  useEffect(() => {

    const loadProfile =
      async () => {

        try {

          const profile =
            await getMyProfile();

          setEmail(
            profile.email,
          );

          reset({
            name:
              profile.name || "",

            phone:
              profile.phone || "",

            country:
              profile.country || "",

            companyName:
              profile.companyName || "",

            city:
              profile.city || "",

            address:
              profile.address || "",
          });

        } catch (error) {

          console.error(error);

          toast.error(
            "Error cargando perfil",
          );

        } finally {

          setLoading(false);
        }
      };

    loadProfile();

  }, [reset]);

  const onSubmit = async (
    data: ProfileFormData,
  ) => {

    try {

      setSaving(true);

      await updateMyProfile(
        data,
      );

      toast.success(
        "Perfil actualizado correctamente",
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Error actualizando perfil",
      );

    } finally {

      setSaving(false);
    }
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando perfil...
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-20 px-6 bg-[#070707]">

      <div className="max-w-5xl mx-auto">

        <div className="mb-10">

          <h1 className="text-4xl font-semibold text-white mb-3">
            Mi perfil
          </h1>

          <p className="text-gray-400">
            Gestioná tu información personal y empresarial.
          </p>

        </div>

        <div className="bg-[#0D1117] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-8 border-b border-white/10">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-2xl bg-[#C7962D]/10 border border-[#C7962D]/20 flex items-center justify-center text-3xl font-semibold text-[#C7962D]">
                {email?.charAt(0).toUpperCase()}
              </div>

              <div>

                <h2 className="text-2xl font-semibold text-white">
                  {email}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Cuenta empresarial ViaCore
                </p>

              </div>

            </div>

          </div>

        <form
  onSubmit={handleSubmit(
    onSubmit,
    () => {

      const values = getValues();

      const hasEmptyFields =
        Object.values(values).some(
          (value) =>
            !String(value).trim(),
        );

      if (hasEmptyFields) {

        toast.warning(
          "Debes completar todos los campos",
        );
      }
    },
  )}
  className="space-y-10"
>

            <div>

              <h3 className="text-lg font-semibold text-white mb-6">
                Información personal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <Input
                    placeholder="Nombre"
                    {...register(
                      "name",
                    )}
                  />

    {dirtyFields.name &&
 getValues("name").trim() !== "" &&
 errors.name?.message && (
  <p className="text-red-400 text-xs mt-2">
    {String(errors.name.message)}
  </p>
)}

                </div>

                <div>

                  <Input
                    placeholder="Teléfono"
                    {...register(
                      "phone",
                    )}
                  />

     {dirtyFields.phone &&
 getValues("phone").trim() !== "" &&
 errors.phone?.message && (

  <p className="text-red-400 text-xs mt-2">
    {String(errors.phone.message)}
  </p>
)}

                </div>

                <div>

                  <select
                    {...register(
                      "country",
                    )}
                    className="
                      w-full
                      p-3
                      rounded-md
                      bg-[#0f1115]
                      border
                      border-white/10
                      text-white
                      outline-none
                      transition-all
                      focus:border-[#C7962D]
                      focus:ring-1
                      focus:ring-[#C7962D]/40
                    "
                  >

                    <option value="">
                      Seleccionar país
                    </option>

                    <option value="Argentina">
                      Argentina
                    </option>

                    <option value="Chile">
                      Chile
                    </option>

                    <option value="Colombia">
                      Colombia
                    </option>

                    <option value="México">
                      México
                    </option>

                    <option value="Perú">
                      Perú
                    </option>

                    <option value="Uruguay">
                      Uruguay
                    </option>

                  </select>

                  {errors.country
                    ?.message && (

                    <p className="text-red-400 text-xs mt-2">
                      {String(
                        errors.country
                          .message,
                      )}
                    </p>

                  )}

                </div>

                <div>

                  <Input
                    placeholder="Ciudad"
                    {...register(
                      "city",
                    )}
                  />

       {dirtyFields.city &&
 getValues("city").trim() !== "" &&
 errors.city?.message && (

  <p className="text-red-400 text-xs mt-2">
    {String(errors.city.message)}
  </p>
)}

                </div>

              </div>

            </div>

            <div>

              <h3 className="text-lg font-semibold text-white mb-6">
                Información empresarial
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <Input
                    placeholder="Empresa"
                    {...register(
                      "companyName",
                    )}
                  />

       {dirtyFields.companyName &&
 getValues("companyName").trim() !== "" &&
 errors.companyName?.message && (

  <p className="text-red-400 text-xs mt-2">
    {String(errors.companyName.message)}
  </p>
)}

                </div>

                <div>

                  <Input
                    placeholder="Dirección"
                    {...register(
                      "address",
                    )}
                  />

     {dirtyFields.address &&
 getValues("address").trim() !== "" &&
 errors.address?.message && (

  <p className="text-red-400 text-xs mt-2">
    {String(errors.address.message)}
  </p>
)}

                </div>

              </div>

            </div>

            <div className="flex justify-end pt-4">

              <Button
                type="submit"
                className={`min-w-55 ${
                  saving
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
              >
                {saving
                  ? "Guardando..."
                  : "Guardar cambios"}
              </Button>

            </div>

          </form>

        </div>

      </div>

    </section>
  );
}
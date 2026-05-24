"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { completeProfile } from "@/services/auth.service";
import { toast } from "sonner";
import { completeProfileSchema } from "@/validations/complete.profile.validations";

export default function CompleteProfileForm() {
  const [formData, setFormData] = useState({
    phone: "",
    country: "",
    companyName: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    const updatedValues = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedValues);

    const result = completeProfileSchema.safeParse(updatedValues);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const validation = completeProfileSchema.safeParse(formData);

    if (!validation.success) {
      toast.warning("Debes completar todos los campos");
      return;
    }

    try {
      setLoading(true);

      await completeProfile(formData);

      setFormData({
        phone: "",
        country: "",
        companyName: "",
        city: "",
        address: "",
      });

      setErrors({});
      setTouched({});

      toast.success("Perfil completado correctamente");

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("Error al completar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            name="phone"
            type="tel"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone ? errors.phone : ""}
          />
          <p className="mt-2 text-xs text-gray-500">
            Número de contacto de la empresa
          </p>
        </div>

        <div className="space-y-2">
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border bg-[#0D0D0D] px-4 py-3 text-sm text-white outline-none transition ${
              touched.country && errors.country
                ? "border-red-500"
                : "border-white/10 focus:border-[#C7962D]"
            }`}
          >
            <option value="">🌍 Seleccionar país</option>
            <option value="Argentina">🇦🇷 Argentina</option>
            <option value="Uruguay">🇺🇾 Uruguay</option>
            <option value="Chile">🇨🇱 Chile</option>
            <option value="Brasil">🇧🇷 Brasil</option>
            <option value="México">🇲🇽 México</option>
            <option value="Colombia">🇨🇴 Colombia</option>
            <option value="Perú">🇵🇪 Perú</option>
            <option value="España">🇪🇸 España</option>
            <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
          </select>

          {touched.country && errors.country && (
            <p className="text-sm text-red-400">{errors.country}</p>
          )}

          <p className="text-xs text-gray-500">País donde opera la empresa</p>
        </div>

        <div>
          <Input
            name="city"
            type="text"
            placeholder="Ciudad"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.city ? errors.city : ""}
          />
          <p className="mt-2 text-xs text-gray-500">Ciudad principal</p>
        </div>

        <div>
          <Input
            name="address"
            type="text"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.address ? errors.address : ""}
          />
          <p className="mt-2 text-xs text-gray-500">Dirección empresarial</p>
        </div>

        <div className="col-span-2">
          <Input
            name="companyName"
            type="text"
            placeholder="Empresa"
            value={formData.companyName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.companyName ? errors.companyName : ""}
          />
          <p className="mt-2 text-xs text-gray-500">
            Nombre de la empresa o institución
          </p>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Finalizar configuración"}
      </Button>
    </form>
  );
}

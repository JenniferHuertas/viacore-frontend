"use client";

import React, {
  useState,
} from "react";

import { toast } from "sonner";

import { contactSchema } from "@/validations/contact.validations";

import { sendContactMessage } from "@/services/contact.service";

export default function ContactoView() {
  const [form, setForm] =
    useState({
      nombre: "",
      email: "",
      empresa: "",
      mensaje: "",
    });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [errors, setErrors] =
    useState<Record<string, string>>(
      {},
    );

  const [loading, setLoading] =
    useState(false);

  const validateForm = (
    values: typeof form,
  ) => {
    const result =
      contactSchema.safeParse(
        values,
      );

    if (!result.success) {
      const fieldErrors: Record<
        string,
        string
      > = {};

      result.error.issues.forEach(
        (issue) => {
          const field =
            issue.path[0] as string;

          fieldErrors[field] =
            issue.message;
        },
      );

      setErrors(fieldErrors);

      return false;
    }

    setErrors({});

    return true;
  };

        const handleBlur = (
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => {
  const { name } = e.target;

  setTouched((prev) => ({
    ...prev,
    [name]: true,
  }));
};

 const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => {
  const { name, value } = e.target;

  const updatedValues = {
    ...form,
    [name]: value,
  };

  setForm(updatedValues);

  const result =
    contactSchema.safeParse(
      updatedValues,
    );

  if (!result.success) {
    const fieldErrors: Record<
      string,
      string
    > = {};

    result.error.issues.forEach(
      (issue) => {
        const field =
          issue.path[0] as string;

        fieldErrors[field] =
          issue.message;
      },
    );

    setErrors(fieldErrors);
  } else {
    setErrors({});
  }
};

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const isValid =
      validateForm(form);

    if (!isValid) {
      toast.warning("Debes completar todos los campos")
      return;
    }

    try {
      setLoading(true);

      await sendContactMessage(
        form,
      );

      toast.success(
        "Tu consulta fue enviada correctamente. Nuestro equipo revisará tu mensaje y se pondrá en contacto con vos.",
      );

      setForm({
        nombre: "",
        email: "",
        empresa: "",
        mensaje: "",
      });

      setErrors({});
    } catch (error) {
      console.error(error);

      toast.error(
        "No pudimos enviar tu consulta. Intentá nuevamente en unos minutos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen">

      <div className="mx-auto max-w-2xl">

        <h1 className="text-3xl font-semibold mb-6">
          Contacto
        </h1>

        <p className="text-gray-400 mb-10">
          Dejanos tu consulta y te responderemos a la brevedad.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="space-y-2">

            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`
                w-full
                p-3
                bg-white/5
                border
                rounded
                outline-none
                transition

                ${
                  touched.nombre && errors.nombre
                    ? "border-red-500"
                    : "border-white/10 focus:border-[#C7962D]"
                }
              `}
            />

          {touched.nombre && errors.nombre && (
  <p className="text-sm text-red-400">
    {errors.nombre}
  </p>
)}

          </div>

          <div className="space-y-2">

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`
                w-full
                p-3
                bg-white/5
                border
                rounded
                outline-none
                transition

                ${
                 touched.email && errors.email
                    ? "border-red-500"
                    : "border-white/10 focus:border-[#C7962D]"
                }
              `}
            />

            {touched.email && errors.email && (
              <p className="text-sm text-red-400">
                {errors.email}
              </p>
            )}

          </div>

          <div className="space-y-2">

            <input
              name="empresa"
              placeholder="Empresa"
              value={form.empresa}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`
                w-full
                p-3
                bg-white/5
                border
                rounded
                outline-none
                transition

                ${
                 touched.empresa && errors.empresa
                    ? "border-red-500"
                    : "border-white/10 focus:border-[#C7962D]"
                }
              `}
            />

            {touched.empresa && errors.empresa && (
              <p className="text-sm text-red-400">
                {errors.empresa}
              </p>
            )}

          </div>

          <div className="space-y-2">

            <textarea
              name="mensaje"
              placeholder="Mensaje"
              value={form.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={6}
              className={`
                w-full
                p-3
                bg-white/5
                border
                rounded
                outline-none
                resize-none
                transition

                ${
                 touched.mensaje && errors.mensaje
                    ? "border-red-500"
                    : "border-white/10 focus:border-[#C7962D]"
                }
              `}
            />

            {touched.mensaje && errors.mensaje && (
              <p className="text-sm text-red-400">
                {errors.mensaje}
              </p>
            )}

          </div>

          <button
            disabled={loading}
            className="
              cursor-pointer
              w-full
              py-3
              bg-[#C7962D]
              text-black
              font-semibold
              rounded
              hover:opacity-90
              transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Enviando consulta..."
              : "Enviar mensaje"}
          </button>

        </form>

      </div>

    </div>
  );
}
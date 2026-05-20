"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { createTrainingRequest } from "@/services/trainingRequests.service";

import { trainingRequestSchema } from "@/validations/trainingRequest.validations";  

import {toast} from "sonner";

export default function SolicitudesView() {
  const searchParams = useSearchParams();

  const [touched, setTouched] = useState<
  Record<string, boolean>
>({});

  const router = useRouter();

  const [trainingId, setTrainingId] = useState("");

  const [errors, setErrors] = useState<Record<string, any>>({});

  const [form, setForm] = useState({
    categoria: "",
    personas: "",
    objetivo: "",
    contexto: "",
  });

  useEffect(() => {
    const categoria = searchParams.get("categoria") || "";

    const trainingId = searchParams.get("trainingId") || "";

    setTrainingId(trainingId);

    const pending = localStorage.getItem("pendingRequest");
    if (pending) {
      const parsed = JSON.parse(pending);
      localStorage.removeItem("pendingRequest");
      setForm({
        categoria,
        personas: parsed.personas || "",
        objetivo: parsed.objetivo || "",
        contexto: parsed.contexto || "",
      });
    } else {
      setForm((prev) => ({ ...prev, categoria }));
    }
  }, [searchParams]);

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => {

  setForm({
    ...form,

    [e.target.name]: e.target.value,
  });
};

const handleBlur = (
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => {

  const field = e.target.name;

    setTouched((prev) => ({
    ...prev,

    [field]: true,
  }));

  if (!form[field as keyof typeof form]) {
    return;
  }

  const resultado =
    trainingRequestSchema.safeParse(form);

  if (!resultado.success) {

    const formattedErrors =
      resultado.error.format();

    setErrors((prev) => ({
      ...prev,

      [field]:
        formattedErrors[
          field as keyof typeof formattedErrors
        ],
    }));

  } else {

    setErrors((prev) => ({
      ...prev,

      [field]: undefined,
    }));
  }
};

 const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
) => {
  e.preventDefault();

  const resultado =
  trainingRequestSchema.safeParse(form);

if (!resultado.success) {

  toast.warning(
    "Debes completar todos los campos",
  );

  return;
}

  try {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.setItem(
          "pendingRequest",
          JSON.stringify({
            trainingId,
            personas: form.personas,
            objetivo: form.objetivo,
            contexto: form.contexto,
            categoria: form.categoria,
          }),
        );
        router.push("/autenticacion");
        return;
      }

      await createTrainingRequest(
        {
          trainingId,

          participantsCount: Number(form.personas),

          objectives: form.objetivo,

          context: form.contexto,
        },

        token,
      );

      toast.success(
  "Solicitud enviada correctamente",
);

      router.push("/mis-solicitudes");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold mb-6">
          Solicitar capacitación
        </h1>

        <p className="text-gray-400 mb-10">
          Completá el formulario y te contactaremos para diseñar una propuesta a
          medida.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="text-sm text-gray-300">
              Tipo de capacitación
            </label>

            <input
              name="categoria"
              value={form.categoria}
              disabled
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
            /> 
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Cantidad de personas
            </label>

            <input
              name="personas"
              type="number"
              min={1}
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.personas}
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              required
            />

            {touched.personas && errors.personas?._errors?.[0] && (
              <p className="text-red-400 text-sm mt-1">
                {errors.personas._errors[0]}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-300">Objetivo</label>

            <input
              name="objetivo"
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.objetivo}
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              required
            />

            {touched.objetivo && errors.objetivo?._errors?.[0] && (
              <p className="text-red-400 text-sm mt-1">
                {errors.objetivo._errors[0]}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-300">Contexto</label>

            <textarea
              name="contexto"
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.contexto}
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              required
            />

            {touched.contexto && errors.contexto?._errors?.[0] && (
              <p className="text-red-400 text-sm mt-1">
                {errors.contexto._errors[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#C7962D] text-black rounded-md font-semibold hover:opacity-90 transition cursor-pointer"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
  );
}

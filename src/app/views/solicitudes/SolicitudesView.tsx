"use client";

import { useEffect, useState, type SubmitEvent } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { createTrainingRequest } from "@/services/trainingRequests.service";

import { trainingRequestSchema } from "@/validations/training.request.validations";

export default function SolicitudesView() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [trainingId, setTrainingId] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    categoria: "",
    personas: "",
    objetivo: "",
    contexto: "",
  });

  useEffect(() => {
    const categoria = searchParams.get("categoria") || "";

    const trainingIdParam = searchParams.get("trainingId") || "";

    setTrainingId(trainingIdParam);

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
      setForm((prev) => ({
        ...prev,
        categoria,
      }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (!value.trim()) {
      return;
    }

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const updatedForm = {
      ...form,
      [name]: value,
    };

    const validation = trainingRequestSchema.safeParse(updatedForm);

    if (!validation.success) {
      const fieldError = validation.error.issues.find(
        (issue) => issue.path[0] === name,
      );

      setErrors((prev) => ({
        ...prev,
        [name]: fieldError?.message || "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = trainingRequestSchema.safeParse(form);

    if (!validation.success) {
      const hasEmptyFields =
        !form.personas.trim() || !form.objetivo.trim() || !form.contexto.trim();

      if (hasEmptyFields) {
        toast.warning("Debes completar todos los campos");

        return;
      }

      const formattedErrors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;

        if (field && !formattedErrors[field]) {
          formattedErrors[field] = issue.message;
        }
      });

      setTouched({
        personas: true,
        objetivo: true,
        contexto: true,
      });

      setErrors(formattedErrors);

      return;
    }

    try {
      setSubmitting(true);

      if (!trainingId) {
        toast.error("Capacitación inválida");

        return;
      }

      await createTrainingRequest({
        trainingId,

        participantsCount: Number(form.personas),

        objectives: form.objetivo,

        context: form.contexto,
      });

      toast.success("Solicitud enviada correctamente");

      router.replace("/mis-solicitudes");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error enviando solicitud";

      toast.error(message);
    } finally {
      setSubmitting(false);
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
              onChange={handleChange}
              value={form.personas}
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              onBlur={handleBlur}
            />

            {touched.personas && errors.personas && (
              <p className="text-red-400 text-sm mt-1">{errors.personas}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-300">Objetivo</label>

            <input
              name="objetivo"
              onChange={handleChange}
              value={form.objetivo}
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              onBlur={handleBlur}
            />

            {touched.objetivo && errors.objetivo && (
              <p className="text-red-400 text-sm mt-1">{errors.objetivo}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-300">Contexto</label>

            <textarea
              name="contexto"
              onChange={handleChange}
              value={form.contexto}
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              onBlur={handleBlur}
            />

            {touched.contexto && errors.contexto && (
              <p className="text-red-400 text-sm mt-1">{errors.contexto}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#C7962D] text-black rounded-md font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </div>
  );
}

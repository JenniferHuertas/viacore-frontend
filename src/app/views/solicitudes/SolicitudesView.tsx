"use client";

import {
  useEffect,
  useState,
  type SubmitEvent,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { toast } from "sonner";

import { createTrainingRequest } from "@/services/trainingRequests.service";

import { trainingRequestSchema } from "@/validations/trainingRequest.validations";

export default function SolicitudesView() {

  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const [trainingId, setTrainingId] =
    useState("");

  const [errors, setErrors] =
    useState<any>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [form, setForm] =
    useState({
      categoria: "",
      personas: "",
      objetivo: "",
      contexto: "",
    });

  useEffect(() => {

    const categoria =
      searchParams.get(
        "categoria",
      ) || "";

    const trainingIdParam =
      searchParams.get(
        "trainingId",
      ) || "";

    setTrainingId(
      trainingIdParam,
    );

    const pending =
      localStorage.getItem(
        "pendingRequest",
      );

    if (pending) {

      const parsed =
        JSON.parse(
          pending,
        );

      localStorage.removeItem(
        "pendingRequest",
      );

      setForm({
        categoria,

        personas:
          parsed.personas ||
          "",

        objetivo:
          parsed.objetivo ||
          "",

        contexto:
          parsed.contexto ||
          "",
      });

    } else {

      setForm((prev) => ({
        ...prev,
        categoria,
      }));
    }

  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >,
  ) => {

    const updatedForm = {
      ...form,

      [e.target.name]:
        e.target.value,
    };

    setForm(updatedForm);

    const resultado =
      trainingRequestSchema.safeParse(
        updatedForm,
      );

    if (!resultado.success) {

      setErrors(
        resultado.error.format(),
      );

    } else {

      setErrors({});
    }
  };

  const handleSubmit =
    async (
      e: SubmitEvent<HTMLFormElement>,
    ) => {

      e.preventDefault();

      const validation =
        trainingRequestSchema.safeParse(
          form,
        );

      if (!validation.success) {

        setErrors(
          validation.error.format(),
        );

        toast.error(
          "Revisá los campos del formulario",
        );

        return;
      }

      try {

        setSubmitting(true);

        if (!trainingId) {

          toast.error(
            "Capacitación inválida",
          );

          return;
        }

        await createTrainingRequest({
          trainingId,

          participantsCount:
            Number(
              form.personas,
            ),

          objectives:
            form.objetivo,

          context:
            form.contexto,
        });

        toast.success(
          "Solicitud enviada correctamente",
        );

        router.replace(
          "/mis-solicitudes",
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error enviando solicitud",
        );

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
          Completá el formulario y te contactaremos para diseñar una propuesta a medida.
        </p>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >

          <div>

            <label className="text-sm text-gray-300">
              Tipo de capacitación
            </label>

            <input
              name="categoria"
              value={
                form.categoria
              }
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
              onChange={
                handleChange
              }
              value={
                form.personas
              }
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              required
            />

            {errors.personas?._errors?.[0] && (

              <p className="text-red-400 text-sm mt-1">
                {
                  errors.personas
                    ._errors[0]
                }
              </p>

            )}

          </div>

          <div>

            <label className="text-sm text-gray-300">
              Objetivo
            </label>

            <input
              name="objetivo"
              minLength={20}
              onChange={
                handleChange
              }
              value={
                form.objetivo
              }
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              required
            />

            {errors.objetivo?._errors?.[0] && (

              <p className="text-red-400 text-sm mt-1">
                {
                  errors.objetivo
                    ._errors[0]
                }
              </p>

            )}

          </div>

          <div>

            <label className="text-sm text-gray-300">
              Contexto
            </label>

            <textarea
              name="contexto"
              minLength={30}
              onChange={
                handleChange
              }
              value={
                form.contexto
              }
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
              required
            />

            {errors.contexto?._errors?.[0] && (

              <p className="text-red-400 text-sm mt-1">
                {
                  errors.contexto
                    ._errors[0]
                }
              </p>

            )}

          </div>

          <button
            type="submit"
            disabled={
              submitting
            }
            className="w-full py-4 bg-[#C7962D] text-black rounded-md font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            {submitting
              ? "Enviando..."
              : "Enviar solicitud"}
          </button>

        </form>

      </div>

    </div>
  );
}

"use client";

import {
  useEffect,
  useState,
  type SubmitEvent,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  editTrainingRequest,
  getTrainingRequestById,
} from "@/services/trainingRequests.service";

import { editTrainingRequestSchema } from "@/validations/editTrainingRequestValidator";

type Props = {
  id: string;
};

type Solicitud = {
  id: string;

  participantsCount: number;

  objectives: string;

  context: string;

  status: string;

  training?: {
    title?: string;
  };
};

type FormErrors = {
  participantsCount: string;

  objectives: string;

  context: string;
};

export default function EditarSolicitudView({
  id,
}: Props) {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    participantsCount,
    setParticipantsCount,
  ] = useState(1);

  const [objectives, setObjectives] =
    useState("");

  const [context, setContext] =
    useState("");

  const [solicitud, setSolicitud] =
    useState<Solicitud | null>(
      null,
    );

  const [errors, setErrors] =
    useState<FormErrors>({
      participantsCount: "",

      objectives: "",

      context: "",
    });

  const getFieldErrors = (
    values: {
      participantsCount: number;

      objectives: string;

      context: string;
    },
  ): FormErrors => {

    const result =
      editTrainingRequestSchema.safeParse(
        values,
      );

    if (result.success) {

      return {
        participantsCount: "",

        objectives: "",

        context: "",
      };
    }

    const formatted =
      result.error.format();

    return {
      participantsCount:
        formatted
          .participantsCount
          ?._errors?.[0] ??
        "",

      objectives:
        formatted
          .objectives
          ?._errors?.[0] ??
        "",

      context:
        formatted
          .context
          ?._errors?.[0] ??
        "",
    };
  };

  const validateField = (
    field: keyof FormErrors,
    values: {
      participantsCount: number;

      objectives: string;

      context: string;
    },
  ) => {

    const fieldErrors =
      getFieldErrors(values);

    setErrors(fieldErrors);

    const errorMessage =
      fieldErrors[field];

    if (!errorMessage) return;

    switch (field) {

      case "participantsCount":

        toast.error(
          `Participantes: ${errorMessage}`,
          {
            id: "participants-error",
          },
        );

        break;

      case "objectives":

        toast.error(
          `Objetivos: ${errorMessage}`,
          {
            id: "objectives-error",
          },
        );

        break;

      case "context":

        toast.error(
          `Contexto: ${errorMessage}`,
          {
            id: "context-error",
          },
        );

        break;
    }
  };

  useEffect(() => {

    const fetchSolicitud =
      async () => {

        try {

          const data =
            await getTrainingRequestById(
              id,
            );

          setSolicitud(data);

          setParticipantsCount(
            data.participantsCount,
          );

          setObjectives(
            data.objectives,
          );

          setContext(
            data.context,
          );

        } catch (error) {

          console.error(
            "Error obteniendo solicitud",
            error,
          );

          toast.error(
            "Error cargando la solicitud",
          );

        } finally {

          setLoading(false);
        }
      };

    fetchSolicitud();

  }, [id]);

  const handleSubmit = async (
    e: SubmitEvent<HTMLFormElement>,
  ) => {

    e.preventDefault();

    const values = {
      participantsCount,

      objectives,

      context,
    };

    const validation =
      editTrainingRequestSchema.safeParse(
        values,
      );

    if (!validation.success) {

      const fieldErrors =
        getFieldErrors(values);

      setErrors(fieldErrors);

      const firstError =
        Object.values(
          fieldErrors,
        ).find(Boolean);

      toast.error(
        firstError ||
          "Revisá los campos",
      );

      return;
    }

    try {

      setSaving(true);

      await editTrainingRequest(
        id,
        {
          participantsCount,

          objectives,

          context,
        },
      );

      toast.success(
        "Solicitud actualizada correctamente",
      );

      router.push(
        `/mis-solicitudes/${id}`,
      );

    } catch (error) {

      console.error(
        "Error actualizando solicitud",
        error,
      );

      toast.error(
        "Error actualizando solicitud",
      );

    } finally {

      setSaving(false);
    }
  };

  const inputClass = (
    field: keyof FormErrors,
  ) =>
    `w-full rounded-xl border bg-black p-3 text-white outline-none focus:border-[#C7962D] ${
      errors[field]
        ? "border-red-500"
        : "border-white/10"
    }`;

  if (loading) {

    return (
      <div className="container mx-auto px-4 py-16">

        <div className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-6 text-gray-400">
          Cargando solicitud...
        </div>

      </div>
    );
  }

  if (!solicitud) {

    return (
      <div className="container mx-auto px-4 py-16">

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          No se encontró la solicitud.
        </div>

      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black px-4 py-16">

      <div className="mx-auto max-w-4xl space-y-8">

        <div>

          <h1 className="text-4xl font-semibold text-white">
            Editar solicitud
          </h1>

          <div className="mt-3 h-0.5 w-16 bg-[#C7962D]" />

          <p className="mt-4 text-gray-400">
            Actualizá la información de tu solicitud.
          </p>

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6 rounded-2xl border border-white/10 bg-[#0B0D0F] p-8"
        >

          {solicitud.training
            ?.title && (

            <div>

              <p className="text-sm text-gray-400">
                Capacitación
              </p>

              <p className="mt-2 text-lg font-medium text-white">
                {
                  solicitud
                    .training
                    .title
                }
              </p>

            </div>
          )}

          <div className="space-y-2">

            <label className="text-sm text-gray-300">
              Participantes
            </label>

            <input
              type="number"
              min={1}
              value={
                participantsCount
              }
              onChange={(e) => {

                const value =
                  Number(
                    e.target.value,
                  );

                setParticipantsCount(
                  value,
                );

                validateField(
                  "participantsCount",
                  {
                    participantsCount:
                      value,

                    objectives,

                    context,
                  },
                );
              }}
              className={inputClass(
                "participantsCount",
              )}
            />

            {errors.participantsCount && (

              <p className="text-sm text-red-400">
                {
                  errors.participantsCount
                }
              </p>

            )}

          </div>

          <div className="space-y-2">

            <label className="text-sm text-gray-300">
              Objetivos
            </label>

            <textarea
              value={objectives}
              onChange={(e) => {

                const value =
                  e.target.value;

                setObjectives(
                  value,
                );

                validateField(
                  "objectives",
                  {
                    participantsCount,

                    objectives:
                      value,

                    context,
                  },
                );
              }}
              className={`${inputClass(
                "objectives",
              )} min-h-35`}
            />

            {errors.objectives && (

              <p className="text-sm text-red-400">
                {errors.objectives}
              </p>

            )}

          </div>

          <div className="space-y-2">

            <label className="text-sm text-gray-300">
              Contexto organizacional
            </label>

            <textarea
              value={context}
              onChange={(e) => {

                const value =
                  e.target.value;

                setContext(
                  value,
                );

                validateField(
                  "context",
                  {
                    participantsCount,

                    objectives,

                    context:
                      value,
                  },
                );
              }}
              className={`${inputClass(
                "context",
              )} min-h-35`}
            />

            {errors.context && (

              <p className="text-sm text-red-400">
                {errors.context}
              </p>

            )}

          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#C7962D] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>

        </form>

      </div>

    </section>
  );
}
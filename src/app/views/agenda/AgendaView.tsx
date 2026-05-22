"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createMeeting } from "@/services/meetings.service";

import { useUser } from "@/hooks/useUser";

import { meetingSchema } from "@/validations/meeting.validations";

type AgendaViewProps = {
  id: string;
};

export default function AgendaView({
  id,
}: AgendaViewProps) {
  const router = useRouter();

  const { user } = useUser();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      fecha: "",
      horario: "",
    });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: any,
  ) => {
    const updatedForm = {
      ...form,
      [e.target.name]:
        e.target.value,
    };

    setForm(updatedForm);

    const resultado = meetingSchema.safeParse(updatedForm);

    if (!resultado.success) {
      setErrors(resultado.error.format());
    } else {
      setErrors({});
    }
  };

  const handleSubmit =
    async (e: any) => {
      e.preventDefault();

      if (!user?.id) return;

      try {
        setLoading(true);

        await createMeeting({
          date: form.fecha,
          time: form.horario,
          targetUserId: user.id,
          trainingRequestId: id,
        });

        router.push(
          `/mis-solicitudes/${id}`,
        );
      } catch (error) {
        console.error(
          "Error creando reunión",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen">

      <div className="mx-auto max-w-3xl">

        <h1 className="text-3xl md:text-4xl font-semibold mb-6">
          Agendar reunión
        </h1>

        <p className="text-gray-400 mb-10">
          Seleccioná una fecha y
          horario para coordinar
          la reunión inicial.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="text-sm text-gray-300">
              Fecha
            </label>

            <input
              type="date"
              name="fecha"
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
            />

            {errors.fecha?._errors?.[0] && (
              <p className="text-red-400 text-sm mt-1">
                {errors.fecha._errors[0]}
              </p>
            )}

          </div>

          <div>

            <label className="text-sm text-gray-300">
              Horario
            </label>

            <input
              type="time"
              name="horario"
              min="09:00"
              max="17:00"
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 rounded-md bg-white/5 border border-white/10"
            />

            {errors.horario?._errors?.[0] && (
              <p className="text-red-400 text-sm mt-1">
                {errors.horario._errors[0]}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#C7962D] text-black rounded-md font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Agendando..."
              : "Confirmar reunión"}
          </button>

        </form>

      </div>

    </div>
  );
}
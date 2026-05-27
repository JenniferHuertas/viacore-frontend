"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createMeeting, getAvailability } from "@/services/meetings.service";
import { meetingSchema } from "@/validations/meeting.validations";

type AgendaViewProps = {
  id: string;
};

type Slot = {
  start: string;
  end: string;
  formatted?: string;
};

export default function AgendaView({ id }: AgendaViewProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [form, setForm] = useState({ fecha: "", horario: "" });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!form.fecha) {
        setAvailableSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);
        const response = await getAvailability(form.fecha);
        setAvailableSlots(response || []);
      } catch (error) {
        console.error("Error obteniendo disponibilidad", error);
        toast.error("No se pudieron cargar los horarios disponibles.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [form.fecha]);

  const handleDateChange = (e: any) => {
    const updatedForm = { ...form, fecha: e.target.value, horario: "" };
    setForm(updatedForm);

    const resultado = meetingSchema.safeParse(updatedForm);
    if (!resultado.success) {
      setErrors(resultado.error.format());
    } else {
      setErrors({});
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    // Usamos formatted que ya viene en hora local del usuario desde el backend
    const horario = slot.formatted ?? (() => {
      const date = new Date(slot.start);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    })();

    const updatedForm = { ...form, horario };
    setForm(updatedForm);

    const resultado = meetingSchema.safeParse(updatedForm);
    if (!resultado.success) {
      setErrors(resultado.error.format());
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const validation = meetingSchema.safeParse(form);
      if (!validation.success) {
        setErrors(validation.error.format());
        toast.error("Completa correctamente los campos.");
        return;
      }

      await createMeeting({
        date: form.fecha,
        time: form.horario,
        trainingRequestId: id,
      });

      toast.success("Reunión agendada correctamente.");
      router.push(`/mis-solicitudes/${id}`);
    } catch (error: any) {
      console.error("Error creando reunión", error);
      toast.error(error?.message || "No se pudo agendar la reunión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white px-6 pt-32 pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <Link
            href={`/mis-solicitudes/${id}`}
            className="text-sm text-[#C7962D] hover:opacity-80 transition"
          >
            ← Volver a la solicitud
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111315] p-8 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Agendar reunión
          </h1>

          <p className="text-gray-400 mb-10 leading-relaxed">
            Seleccioná una fecha y un horario disponible para coordinar la
            reunión inicial con el equipo de ViaCore.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-sm text-gray-300">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleDateChange}
                required
                className="w-full mt-2 p-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C7962D] transition-all"
              />
              {errors.fecha?._errors?.[0] && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.fecha._errors[0]}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-4">
                Horarios disponibles
              </label>

              {loadingSlots ? (
                <div className="text-sm text-gray-400">
                  Cargando horarios...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4 bg-black/20">
                  No hay horarios disponibles para la fecha seleccionada.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot, index) => {
                    // Usamos formatted directamente — ya viene en hora local del usuario
                    const label = slot.formatted ?? (() => {
                      const date = new Date(slot.start);
                      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
                    })();

                    const isSelected = form.horario === label;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSlotSelect(slot)}
                        className={`rounded-xl border py-3 text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-[#C7962D] text-black border-[#C7962D]"
                            : "bg-black/30 border-white/10 text-white hover:border-[#C7962D]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {errors.horario?._errors?.[0] && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.horario._errors[0]}
                </p>
              )}
            </div>

            <div className="bg-[#181818] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-medium text-[#C7962D] mb-2">
                ¿Qué sucede después?
              </h3>
              <ul className="text-sm text-gray-400 space-y-2 leading-relaxed">
                <li>
                  • Recibirás automáticamente una invitación de Google Calendar.
                </li>
                <li>• La reunión incluirá un enlace de Google Meet.</li>
                <li>• ViaCore enviará recordatorios antes del encuentro.</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !form.horario}
              className="w-full py-4 rounded-xl font-semibold text-black bg-linear-to-r from-[#C7962D] to-[#E0B84F] hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Agendando reunión..." : "Confirmar reunión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTrainingRequestById } from "@/services/trainingRequests.service";
import { rescheduleMeeting, getAvailability } from "@/services/meetings.service";
import { useChatContext } from "@/context/ChatContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { meetingSchema } from "@/validations/meeting.validations";

type SolicitudDetalleViewProps = {
  id: string;
};
type FormData = {
  fecha: string;
  horario: string;
};
type Slot = {
  start: string;
  end: string;
  formatted?: string;
};

export default function SolicitudDetalleView({
  id,
}: SolicitudDetalleViewProps) {
  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReschedule, setShowReschedule] = useState(false);
  const [savingReschedule, setSavingReschedule] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { setTrainingRequestId } = useChatContext();
  const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(meetingSchema),
});
const watchedDate = watch("fecha");
const watchedTime = watch("horario");

const handleDateChange = async (date: string) => {
  if (!date || date.length !== 10) {
    setAvailableSlots([]);

    return;
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() < 2025) {
    setAvailableSlots([]);

    return;
  }

  try {
    setLoadingSlots(true);

    const response = await getAvailability(date);

    console.log("AVAILABILITY RESPONSE:", response);

    setAvailableSlots(response || []);
  } catch (error: any) {
    console.error("ERROR COMPLETO:", error);

    toast.error(
      "No se pudieron cargar los horarios disponibles",
    );
  } finally {
    setLoadingSlots(false);
  }
};

const handleSlotSelect = (slot: Slot) => {
  const horario =
    slot.formatted ??
    (() => {
      const date = new Date(slot.start);

      return `${String(date.getHours()).padStart(
        2,
        "0",
      )}:${String(date.getMinutes()).padStart(
        2,
        "0",
      )}`;
    })();

  setValue("horario", horario);
};

  useEffect(() => {
    setTrainingRequestId(id);

    return () => {
      setTrainingRequestId(undefined);
    };
  }, [id, setTrainingRequestId]);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const data = await getTrainingRequestById(id);

        setSolicitud(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl">
          <p>Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl">
          <p>Solicitud no encontrada</p>
        </div>
      </div>
    );
  }

  const latestMeeting =
    solicitud.meetings?.length > 0
      ? [...solicitud.meetings].sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        )[0]
      : null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";

      case "in_review":
        return "En revisión";

      case "scheduled":
        return "Agendado";

      case "awaiting_payment":
        return "Esperando pago";

      case "confirmed":
        return "Confirmado";

      case "cancelled":
        return "Cancelado";

      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";

      case "in_review":
        return "text-blue-400";

      case "scheduled":
        return "text-purple-400";

      case "awaiting_payment":
        return "text-orange-400";

      case "confirmed":
        return "text-green-400";

      case "cancelled":
        return "text-red-400";

      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-semibold mb-10">
          Detalle de solicitud
        </h1>

        <div className="flex gap-3 text-xs md:text-sm text-gray-500 mb-8 flex-wrap">
          <span
            className={solicitud.status === "pending" ? "text-yellow-400" : ""}
          >
            ● Pendiente
          </span>

          <span>→</span>

          <span
            className={solicitud.status === "in_review" ? "text-blue-400" : ""}
          >
            ● En revisión
          </span>

          <span>→</span>

          <span
            className={
              solicitud.status === "scheduled" ? "text-purple-400" : ""
            }
          >
            ● Agendado
          </span>

          <span>→</span>

          <span
            className={
              solicitud.status === "awaiting_payment" ? "text-orange-400" : ""
            }
          >
            ● Esperando pago
          </span>

          <span>→</span>

          <span
            className={solicitud.status === "confirmed" ? "text-green-400" : ""}
          >
            ● Confirmado
          </span>
        </div>

        <div className="space-y-6 border border-white/10 p-8 rounded-2xl bg-[#0B0D0F]">
          <div>
            <p className="text-gray-400 text-sm">Capacitación</p>

            <p className="text-xl font-medium mt-1">
              {solicitud.training.title}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Estado actual</p>

            <p
              className={`text-lg font-medium mt-1 ${getStatusColor(
                solicitud.status,
              )}`}
            >
              {getStatusLabel(solicitud.status)}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Fecha de solicitud</p>

            <p className="text-lg mt-1">
              {new Date(solicitud.createdAt).toLocaleDateString("es-AR")}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Participantes</p>

            <p className="text-lg mt-1">{solicitud.participantsCount}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Objetivos</p>

            <p className="text-lg mt-1 leading-relaxed wrap-break-word">
              {solicitud.objectives}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Contexto organizacional</p>

            <p className="text-lg mt-1 leading-relaxed wrap-break-word">
              {solicitud.context}
            </p>
          </div>

          <div className="pt-2">
            <p className="text-gray-400 text-sm mb-3">Seguimiento</p>

            <div className="space-y-2 text-sm">
              <p className="text-green-400">
                ✔️ Solicitud registrada correctamente
              </p>

              {solicitud.status === "in_review" && (
                <p className="text-blue-400">
                  ✔️ La solicitud está siendo evaluada
                </p>
              )}

              {solicitud.status === "scheduled" && (
                <p className="text-purple-400">
                  ✔️ Reunión de diagnóstico coordinada
                </p>
              )}

              {solicitud.status === "awaiting_payment" && (
                <p className="text-orange-400">
                  ✔️ Esperando confirmación del pago
                </p>
              )}

              {solicitud.status === "confirmed" && (
                <p className="text-green-400">✔️ Capacitación confirmada</p>
              )}

              {solicitud.status === "cancelled" && (
                <p className="text-red-400">✔️ Solicitud cancelada</p>
              )}
            </div>
          </div>

          {latestMeeting && solicitud.status !== "cancelled" && (
            <div className="border-t border-white/10 pt-6">
              <p className="text-gray-400 text-sm mb-4">Reunión agendada</p>

              <div className="rounded-2xl border border-[#C7962D]/20 bg-[#C7962D]/5 p-6 space-y-5">
                <div>
                  <p className="text-2xl font-semibold text-white">
                    Reunión de diagnóstico
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Coordinación inicial de la capacitación
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-gray-500 text-sm">Fecha</p>

                    <p className="text-white font-medium mt-1 capitalize">
                      {new Date(latestMeeting.startTime).toLocaleDateString(
                        "es-AR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Horario</p>

                    <p className="text-white font-medium mt-1">
                      {new Date(latestMeeting.startTime).toLocaleTimeString(
                        "es-AR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}{" "}
                      hs
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-sm mb-3">
                    Enlace de reunión
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={latestMeeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-[#C7962D] px-6 py-3 font-semibold text-black transition hover:opacity-90 cursor-pointer"
                    >
                      Unirse a la reunión
                    </a>

                    <button
                      onClick={() => setShowReschedule(!showReschedule)}
                      className="rounded-xl border border-white/10 px-6 py-3 text-white hover:bg-white/5 transition cursor-pointer"
                    >
                      Reprogramar
                    </button>
                  </div>
                </div>

                {showReschedule && (
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Reprogramar reunión
                    </h3>

<input
  type="date"
  min={new Date().toISOString().split("T")[0]}
  {...register("fecha", {
    onChange: async (e) => {
      setValue("horario", "");

      await handleDateChange(e.target.value);
    },
  })}
  className="w-full rounded-xl bg-[#111] border border-white/10 p-3 text-white"
/>

<div>
  <p className="text-sm text-gray-300 mb-4">
    Horarios disponibles
  </p>

  {loadingSlots ? (
    <div className="text-sm text-gray-400">
      Cargando horarios...
    </div>
  ) : watchedDate && availableSlots.length === 0 ? (
    <div className="text-sm text-gray-500 border border-white/10 rounded-xl p-4 bg-black/20">
      No hay horarios disponibles para la fecha seleccionada.
    </div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {availableSlots.map((slot, index) => {
        const label =
          slot.formatted ??
          (() => {
            const date = new Date(slot.start);

            return `${String(date.getHours()).padStart(
              2,
              "0",
            )}:${String(date.getMinutes()).padStart(
              2,
              "0",
            )}`;
          })();

        const isSelected = watchedTime === label;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleSlotSelect(slot)}
            className={`rounded-xl border py-3 text-sm font-medium transition-all cursor-pointer ${
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

  {errors.horario && (
    <p className="text-red-500 text-sm mt-2">
      {errors.horario.message}
    </p>
  )}
</div>

<button
type="button"
  disabled={savingReschedule}
  onClick={() => {
if (
  !watch("fecha")?.trim() ||
  !watch("horario")?.trim()
) {
  toast.warning(
    "Debes completar todos los campos",
  );

  return;
}

    handleSubmit(async (data) => {
      try {
        setSavingReschedule(true);

      await rescheduleMeeting(
  latestMeeting.id,
  data.fecha,
  data.horario,
);

        const updated = await getTrainingRequestById(id);

        setSolicitud(updated);

        setShowReschedule(false);

        toast.success(
          "Reunión reprogramada correctamente",
        );
      } catch (error: any) {
        console.error(error);

        toast.error(
          error?.message ||
            "No se pudo reprogramar la reunión",
        );
      } finally {
        setSavingReschedule(false);
      }
    })();
  }}
  className="rounded-xl bg-[#C7962D] px-6 py-3 font-semibold text-black transition hover:opacity-90 cursor-pointer"
>
  {savingReschedule
    ? "Guardando..."
    : "Guardar cambios"}
</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {["awaiting_payment", "confirmed"].includes(solicitud.status) &&
            solicitud.files &&
            solicitud.files.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <p className="text-gray-400 text-sm mb-3">
                  Materiales disponibles
                </p>

                <div className="space-y-3">
                  {solicitud.files.map(
                    (file: { id: string; title?: string; fileUrl: string }) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {file.title || "Archivo"}
                          </p>
                        </div>

                        <button
                          onClick={async () => {
                            const response = await fetch(file.fileUrl);

                            const blob = await response.blob();

                            const url = window.URL.createObjectURL(blob);

                            const a = document.createElement("a");

                            a.href = url;

                            a.download = file.title?.endsWith(".pdf")
                              ? file.title
                              : `${file.title}.pdf`;

                            a.click();

                            window.URL.revokeObjectURL(url);
                          }}
                          className="rounded-lg border border-[#C7962D]/30 px-4 py-2 text-sm text-[#C7962D] hover:bg-[#C7962D]/10 transition cursor-pointer"
                        >
                          Descargar
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>

        {solicitud.status === "in_review" && !latestMeeting && (
          <div className="mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border border-blue-500/20 bg-blue-500/10 rounded-xl p-5">
            <span className="text-sm text-blue-300">
              Tu solicitud fue aprobada para coordinación inicial.
            </span>

            <Link
              href={`/agenda/${solicitud.id}`}
              className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:opacity-90 transition text-center"
            >
              Agendar reunión
            </Link>
          </div>
        )}

        {solicitud.status === "awaiting_payment" && (
          <div className="mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border border-[#C7962D]/20 bg-[#C7962D]/10 rounded-xl p-5">
            <span className="text-sm text-[#F4D27A]">
              La reunión fue coordinada correctamente.
            </span>

            <Link
              href={`/pago/${solicitud.id}`}
              className="px-6 py-3 bg-[#C7962D] text-black rounded-md font-semibold text-center"
            >
              Continuar al pago
            </Link>
          </div>
        )}

        {["pending", "in_review"].includes(solicitud.status) && (
          <div className="mt-10 flex gap-4">
            <Link
              href={`/mis-solicitudes/edit/${solicitud.id}`}
              className="rounded-xl bg-[#C7962D] px-6 py-3 font-semibold text-black transition hover:opacity-90"
            >
              Editar solicitud
            </Link>
          </div>
        )}

        <Link
          href="/mis-solicitudes"
          className="text-[#C7962D] hover:underline mt-6 inline-block"
        >
          ← Volver
        </Link>
      </div>
    </div>
  );
}

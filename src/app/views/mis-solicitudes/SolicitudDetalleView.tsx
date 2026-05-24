"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { getTrainingRequestById } from "@/services/trainingRequests.service";

import { useChatContext } from "@/context/ChatContext";

type SolicitudDetalleViewProps = {
  id: string;
};

export default function SolicitudDetalleView({
  id,
}: SolicitudDetalleViewProps) {

  const [solicitud, setSolicitud] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const { setTrainingRequestId } =
    useChatContext();

  useEffect(() => {

    setTrainingRequestId(id);

    return () => {

      setTrainingRequestId(undefined);

    };

  }, [
    id,
    setTrainingRequestId,
  ]);

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

  const agendaGuardada =
    typeof window !== "undefined"
      ? localStorage.getItem(`agenda-${solicitud.id}`)
      : null;

  const tieneAgenda = !!agendaGuardada;

  const agendaData = agendaGuardada ? JSON.parse(agendaGuardada) : null;

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
                          className="rounded-lg border border-[#C7962D]/30 px-4 py-2 text-sm text-[#C7962D] hover:bg-[#C7962D]/10 transition"
                        >
                          Descargar
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {tieneAgenda && agendaData && (
            <div className="border-t border-white/10 pt-6">
              <p className="text-gray-400 text-sm mb-2">Reunión agendada</p>

              <p className="text-lg">
                {agendaData.fecha} — {agendaData.horario}
              </p>
            </div>
          )}
        </div>

        {solicitud.status === "in_review" && !tieneAgenda && (
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

        {solicitud.status ===
          "awaiting_payment" && (

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
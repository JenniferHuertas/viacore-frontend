"use client";

import { useEffect, useState } from "react";

import { cancelMeeting, getMeetings } from "@/services/meetings.service";

type Meeting = {
  id: string;

  startTime: string;

  endTime: string;

  status: string;

  meetLink: string;

  trainingRequest?: {
    id: string;

    status?: string;

    training?: {
      title?: string;
    };
  };

  user?: {
    name?: string;

    email?: string;

    companyName?: string;
  };
};

export default function AdminMeetingsView() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const data = await getMeetings();

      setMeetings(data);
    } catch (error) {
      console.error("Error obteniendo reuniones", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelMeeting(id);

      fetchMeetings();
    } catch (error) {
      console.error("Error cancelando reunión", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-500/10 text-yellow-400";
      case "Confirmada":
        return "bg-green-500/10 text-green-400";
      case "Cancelada":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-white/10 text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "Pendiente";
      case "Confirmada":
        return "Confirmada";
      case "Cancelada":
        return "Cancelada";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-6 text-gray-400">
        Cargando reuniones...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Reuniones</h1>

        <div className="h-0.5 w-14 bg-[#C7962D] mt-3" />

        <p className="mt-3 text-sm text-gray-400">
          Gestión administrativa de reuniones corporativas.
        </p>
      </div>

      {meetings.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-10 text-center text-gray-400">
          No hay reuniones registradas.
        </div>
      ) : (
        <div className="grid gap-5">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-6"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Estado:</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                        meeting.status,
                      )}`}
                    >
                      {getStatusLabel(meeting.status)}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {meeting.user?.companyName || "Empresa"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      {meeting.user?.email}
                    </p>
                  </div>

                  {meeting.trainingRequest?.training?.title && (
                    <div>
                      <p className="text-sm text-gray-400">Capacitación</p>

                      <p className="text-base text-white mt-1">
                        {meeting.trainingRequest.training.title}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    <span>
                      📅{" "}
                      {new Date(meeting.startTime).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>

                    <span>
                      🕒{" "}
                      {new Date(meeting.startTime).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      hs
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {meeting.status !== "Cancelada" && (
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border cursor-pointer border-[#C7962D]/30 px-5 py-3 text-sm font-medium text-[#C7962D] transition hover:bg-[#C7962D]/10"
                    >
                      Entrar a Meet
                    </a>
                  )}

                  {meeting.status !== "Cancelada" && (
                    <button
                      onClick={() => handleCancel(meeting.id)}
                      className="rounded-xl border border-red-500/30 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

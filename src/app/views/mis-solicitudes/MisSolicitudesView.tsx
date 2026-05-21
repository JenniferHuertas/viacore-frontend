"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  getMyTrainingRequests,
} from "@/services/trainingRequests.service";

import { socket } from "@/lib/socket";

interface TrainingRequest {
  id: string;

  status:
    | "pending"
    | "scheduled"
    | "in_review"
    | "awaiting_payment"
    | "confirmed"
    | "cancelled";

  createdAt: string;

  training: {
    title: string;
  };
}

export default function MisSolicitudesView() {

  const [solicitudes, setSolicitudes] =
    useState<
      TrainingRequest[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchRequests =
      async () => {

        try {

          const data =
            await getMyTrainingRequests();

          setSolicitudes(data);

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);

        }
      };

    fetchRequests();

    socket.on(
      "notification:new",
      async () => {

        const updatedRequests =
          await getMyTrainingRequests();

        setSolicitudes(
          updatedRequests,
        );
      },
    );

    return () => {

      socket.off(
        "notification:new",
      );
    };

  }, []);

  return (
    <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl md:text-4xl font-semibold mb-10">
          Mis solicitudes
        </h1>

        {loading ? (

          <p className="text-gray-400">
            Cargando solicitudes...
          </p>

        ) : solicitudes.length === 0 ? (

          <div className="border border-white/10 rounded-xl bg-white/5 p-10 text-center">
            <p className="text-gray-400">
              Todavía no realizaste
              ninguna solicitud.
            </p>
          </div>

        ) : (

          <div className="space-y-6">

            {solicitudes.map((sol) => {

              const estadoVisual =
                sol.status ===
                "confirmed"
                  ? "Confirmado"
                  : sol.status ===
                    "cancelled"
                  ? "Cancelado"
                  : sol.status ===
                    "scheduled"
                  ? "Agendado"
                  : sol.status ===
                    "in_review"
                  ? "En revisión"
                  : sol.status ===
                    "awaiting_payment"
                  ? "Esperando pago"
                  : "Pendiente";

              return (
                <div
                  key={sol.id}
                  className="border border-white/10 p-6 rounded-xl bg-white/5 flex flex-col md:flex-row md:items-center md:justify-between"
                >

                  <div>

                    <h3 className="text-lg font-semibold">
                      {sol.training.title}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      Fecha:{" "}
                      {new Date(
                        sol.createdAt,
                      ).toLocaleDateString(
                        "es-AR",
                      )}
                    </p>

                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-4">

                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        estadoVisual ===
                        "Pendiente"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : estadoVisual ===
                              "Confirmado"
                          ? "bg-green-500/20 text-green-400"
                          : estadoVisual ===
                              "Cancelado"
                          ? "bg-red-500/20 text-red-400"
                          : estadoVisual ===
                              "Agendado"
                          ? "bg-purple-500/20 text-purple-400"
                          : estadoVisual ===
                              "En revisión"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {estadoVisual}
                    </span>

                    <Link
                      href={`/mis-solicitudes/${sol.id}`}
                      className="text-sm text-[#C7962D] hover:underline"
                    >
                      Ver detalle
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import AdminLayout from "@/components/admin/AdminLayout";

import Link from "next/link";

import {
  getTrainingRequests,
  updateTrainingRequestStatus,
} from "@/services/trainingRequests.service";

import { socket } from "@/lib/socket";

import { createPortal } from "react-dom";

type Request = {
  id: string;

  participantsCount: number;

  objectives: string;

  context: string;

  status:
    | "pending"
    | "scheduled"
    | "in_review"
    | "awaiting_payment"
    | "confirmed"
    | "cancelled";

  user?: {
    companyName?: string;
  };
};

const statusStyles = {
  pending: "bg-yellow-500/10 text-yellow-400",

  confirmed: "bg-green-500/10 text-green-400",

  cancelled: "bg-red-500/10 text-red-400",

  scheduled: "bg-purple-500/10 text-purple-400",

  in_review: "bg-blue-500/10 text-blue-400",

  awaiting_payment: "bg-orange-500/10 text-orange-400",
};

function ConfirmCancelModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0B0D0F] border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-semibold text-white">
          ¿Cancelar solicitud?
        </h2>
        <div className="h-0.5 w-10 bg-[#C7962D] mt-2 mb-4" />
        <p className="text-gray-400 text-sm">
          Esta acción no se puede deshacer. ¿Estás seguro de que querés cancelar
          esta solicitud?
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition"
          >
            No, volver
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function RequestsView() {
  const [requests, setRequests] = useState<Request[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [pendingCancel, setPendingCancel] = useState<{ id: string } | null>(
    null,
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const response = await getTrainingRequests(page, 10);

        setRequests(response.data);

        if (response.meta) {
          setTotalPages(response.meta.totalPages);
        }

        if (!socket.connected) {
          socket.connect();
        }

        socket.emit("join-admin");
      } catch (error) {
        console.error("Error obteniendo solicitudes", error);

        toast.error("Error cargando la tabla");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [page]);

  useEffect(() => {
    socket.on("notification:admin", async () => {
      const response = await getTrainingRequests(page, 10);

      setRequests(response.data);

      if (response.meta) {
        setTotalPages(response.meta.totalPages);
      }
    });

    return () => {
      socket.off("notification:admin");
    };
  }, [page]);

  const handleStatusChange = async (
    id: string,
    newStatus: Request["status"],
  ) => {
    if (newStatus === "cancelled") {
      setPendingCancel({ id });

      return;
    }

    try {
      await updateTrainingRequestStatus(id, newStatus);

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req,
        ),
      );

      toast.success("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando estado", error);

      toast.error("Error actualizando estado");
    }
  };

  const confirmCancel = async () => {
    if (!pendingCancel) return;

    try {
      await updateTrainingRequestStatus(
        pendingCancel.id,
        "cancelled",
      );

      setRequests((prev) =>
        prev.map((req) =>
          req.id === pendingCancel.id
            ? { ...req, status: "cancelled" }
            : req,
        ),
      );

      toast.success("Solicitud cancelada");
    } catch (error) {
      console.error("Error cancelando la solicitud", error);

      toast.error("Error cancelando la solicitud");
    } finally {
      setPendingCancel(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Solicitudes
          </h1>

          <div className="h-0.5 w-12 bg-[#C7962D] mt-2" />

          <p className="text-gray-400 mt-2">
            Gestión de solicitudes de capacitación.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          {loading ? (
            <div className="p-8 text-center text-gray-400 animate-pulse">
              Cargando página {page}...
            </div>
          ) : (
            <table className="w-full text-sm min-w-200">
              <thead className="border-b border-white/10 text-gray-400">
                <tr>
                  <th className="p-4 text-left">Empresa</th>

                  <th className="p-4 text-left">Objetivos</th>

                  <th className="p-4 text-left">Estado</th>

                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-gray-500"
                    >
                      No hay solicitudes registradas en esta página.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-white/5"
                    >
                      <td className="p-4">
                        {req.user?.companyName || "Empresa"}
                      </td>

                      <td className="p-4 max-w-xs truncate">
                        {req.objectives}
                      </td>

                      <td className="p-4 space-y-2">
                        <span
                          className={`text-xs px-2 py-1 rounded block w-fit ${statusStyles[req.status]}`}
                        >
                          {req.status === "pending"
                            ? "Pendiente"
                            : req.status === "confirmed"
                              ? "Confirmada"
                              : req.status === "cancelled"
                                ? "Cancelada"
                                : req.status === "scheduled"
                                  ? "Agendada"
                                  : req.status === "in_review"
                                    ? "En revisión"
                                    : "Esperando pago"}
                        </span>

                        <select
                          value={req.status}
                          disabled={req.status === "cancelled"}
                          onChange={(e) =>
                            handleStatusChange(
                              req.id,
                              e.target.value as Request["status"],
                            )
                          }
                          className="bg-transparent border border-white/10 rounded px-2 py-1 text-xs text-gray-300 cursor-pointer disabled:opacity-50"
                        >
                          <option
                            value="pending"
                            disabled={req.status !== "pending"}
                          >
                            Pendiente
                          </option>

                          <option
                            value="in_review"
                            disabled={req.status === "scheduled"}
                          >
                            En revisión
                          </option>

                          <option value="awaiting_payment">
                            Esperando pago
                          </option>

                          <option
                            value="confirmed"
                            disabled={req.status === "scheduled"}
                          >
                            Confirmada
                          </option>

                          <option value="scheduled">
                            Agendada
                          </option>

                          <option value="cancelled">
                            Cancelada
                          </option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/requests/${req.id}`}
                        >
                          <button className="text-[#C7962D] hover:underline cursor-pointer">
                            Ver detalle
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {!loading && requests.length > 0 && (
            <div className="flex items-center justify-between border-t border-white/10 p-4">
              <button
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                disabled={page === 1}
                className="rounded-md border border-white/10 bg-black/50 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Anterior
              </button>

              <span className="text-sm text-gray-400">
                Página{" "}
                <strong className="text-white">
                  {page}
                </strong>{" "}
                de{" "}
                <strong className="text-white">
                  {totalPages}
                </strong>
              </span>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(totalPages, p + 1),
                  )
                }
                disabled={page >= totalPages}
                className="rounded-md border border-white/10 bg-black/50 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>

      {pendingCancel && (
        <ConfirmCancelModal
          onConfirm={confirmCancel}
          onCancel={() => setPendingCancel(null)}
        />
      )}
    </AdminLayout>
  );
}
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  getTrainingRequests,
  updateTrainingRequest,
} from "@/services/trainingRequests.service";

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

export default function RequestsView() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await getTrainingRequests(token, page, 10);
        setRequests(response.data);
        if (response.meta) {
          setTotalPages(response.meta.totalPages);
        }
      } catch (error) {
        console.error("Error obteniendo solicitudes", error);
        toast.error("Error cargando la tabla");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [page]);

  const handleStatusChange = async (
    id: string,
    newStatus: Request["status"],
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await updateTrainingRequest(id, { status: newStatus }, token);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Solicitudes</h1>
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
            <table className="w-full text-sm min-w-[800px]">
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
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No hay solicitudes registradas en esta página.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="border-b border-white/5">
                      <td className="p-4">
                        {req.user?.companyName || "Empresa"}
                      </td>
                      <td className="p-4 max-w-xs truncate">{req.objectives}</td>
                      <td className="p-4 space-y-2">
                        <span className={`text-xs px-2 py-1 rounded block w-fit ${statusStyles[req.status]}`}>
                          {req.status === "pending" ? "Pendiente"
                            : req.status === "confirmed" ? "Confirmada"
                            : req.status === "cancelled" ? "Cancelada"
                            : req.status === "scheduled" ? "Agendada"
                            : req.status === "in_review" ? "En revisión"
                            : "Esperando pago"}
                        </span>
                        <select
                          value={req.status}
                          disabled={req.status === "cancelled"}
                          onChange={(e) => handleStatusChange(req.id, e.target.value as Request["status"])}
                          className="bg-transparent border border-white/10 rounded px-2 py-1 text-xs text-gray-300 cursor-pointer disabled:opacity-50"
                        >
                          <option value="pending" disabled={req.status !== "pending"}>Pendiente</option>
                          <option value="in_review" disabled={req.status === "scheduled"}>En revisión</option>
                          <option value="awaiting_payment">Esperando pago</option>
                          <option value="confirmed" disabled={req.status === "scheduled"}>Confirmada</option>
                          <option value="scheduled">Agendada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/requests/${req.id}`}>
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-white/10 bg-black/50 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-400">
                Página <strong className="text-white">{page}</strong> de <strong className="text-white">{totalPages}</strong>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-md border border-white/10 bg-black/50 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import AdminLayout from "@/components/admin/AdminLayout";

import { getPayments } from "@/services/payments.service";

type Payment = {
  id: string;

  user: {
    name?: string;

    email: string;
  };

  amount: number;

  status: string;

  method: string;

  createdAt: string;
};

const paymentStatusMap: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  approved: {
    label: "Aprobado",
    className:
      "bg-green-500/10 text-green-400",
  },

  paid: {
    label: "Pagado",
    className:
      "bg-blue-500/10 text-blue-400",
  },

  pending: {
    label: "Pendiente",
    className:
      "bg-yellow-500/10 text-yellow-400",
  },

  rejected: {
    label: "Rechazado",
    className:
      "bg-red-500/10 text-red-400",
  },
};

export default function PaymentsView() {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [startDate, setStartDate] =
    useState(today);

  const [endDate, setEndDate] =
    useState(today);

  const [status, setStatus] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const fetchPayments =
    async () => {
      try {
        setLoading(true);

        const data =
          await getPayments({
            startDate,

            endDate,

            status:
              status || undefined,

            page: currentPage,
          });

        const paymentsArray =
          data.data
            ? data.data
            : Array.isArray(data)
              ? data
              : [];

        setPayments(
          paymentsArray,
        );

        setTotalPages(
          data.totalPages ?? 1,
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Error obteniendo pagos",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const handleSearch = () => {
    if (
      !startDate ||
      !endDate
    ) {
      toast.error(
        "Las fechas son obligatorias",
      );

      return;
    }

    setCurrentPage(1);

    fetchPayments();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Pagos
          </h1>

          <div className="h-0.5 w-12 bg-[#C7962D] mt-2" />

          <p className="text-gray-400 mt-2">
            Consulta y gestión de
            pagos realizados.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value,
              )
            }
            className="rounded bg-black p-2 text-white border border-white/10"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value,
              )
            }
            className="rounded bg-black p-2 text-white border border-white/10"
          />

          <button
            onClick={
              handleSearch
            }
            className="rounded bg-[#C7962D] px-4 py-2 font-semibold text-black cursor-pointer"
          >
            Buscar
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-4 text-left">
                  Usuario
                </th>

                <th className="p-4 text-left">
                  Monto
                </th>

                <th className="p-4 text-left">
                  Método
                </th>

                <th className="p-4 text-left">
                  Estado
                </th>

                <th className="p-4 text-left">
                  Fecha
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map(
                (payment) => {
                  const statusData =
                    paymentStatusMap[
                      payment.status
                    ] ?? {
                      label:
                        payment.status,
                      className:
                        "bg-white/10 text-gray-400",
                    };

                  return (
                    <tr
                      key={
                        payment.id
                      }
                      className="border-b border-white/5"
                    >
                      <td className="p-4">
                        <div>
                          {payment
                            .user
                            ?.name ??
                            "—"}
                        </div>

                        <div className="text-gray-400 text-xs">
                          {
                            payment
                              .user
                              ?.email
                          }
                        </div>
                      </td>

                      <td className="p-4 text-gray-300">
                        $
                        {
                          payment.amount
                        }
                      </td>

                      <td className="p-4 text-gray-300 capitalize">
                        {
                          payment.method
                        }
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${statusData.className}`}
                        >
                          {
                            statusData.label
                          }
                        </span>
                      </td>

                      <td className="p-4 text-gray-400">
                        {new Date(
                          payment.createdAt,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 p-4">
              <span className="text-sm text-gray-400">
                Página{" "}
                {
                  currentPage
                }{" "}
                de{" "}
                {
                  totalPages
                }
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage(
                      (p) =>
                        Math.max(
                          1,
                          p - 1,
                        ),
                    )
                  }
                  disabled={
                    currentPage ===
                    1
                  }
                  className="rounded bg-white/5 px-4 py-2 text-sm text-white disabled:opacity-50 cursor-pointer"
                >
                  Anterior
                </button>

                <button
                  onClick={() =>
                    setCurrentPage(
                      (p) =>
                        p + 1,
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="rounded bg-[#C7962D] px-4 py-2 text-sm text-white disabled:opacity-50 cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-gray-400 animate-pulse">
            Cargando pagos...
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import { getUsers } from "@/services/users.service";

import { getTrainingRequests } from "@/services/trainingRequests.service";

import { getMeetings } from "@/services/meetings.service";

import { getPayments } from "@/services/payments.service";

type Meeting = {
  id: string;
  date: string;
  time: string;
  status: number;
  user?: {
    name?: string;
    companyName?: string;
  };
  trainingRequest?: {
    training?: {
      title?: string;
    };
  };
};

type Payment = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
};

type Request = {
  id: string;
  status: string;
  createdAt: string;
  user?: {
    name?: string;
    companyName?: string;
  };
  training?: {
    title?: string;
  };
};

export default function AdminView() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      users: 0,
      requests: 0,
      trainings: 0,
      meetings: 0,
      payments: 0,
      paymentsAmount: 0,
    });

  const [
    upcomingMeetings,
    setUpcomingMeetings,
  ] = useState<Meeting[]>([]);

  const [
    latestRequests,
    setLatestRequests,
  ] = useState<Request[]>([]);

  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          const [
            usersData,
            requestsData,
            meetingsData,
            paymentsData,
          ] = await Promise.all([
            getUsers(),

            getTrainingRequests(),

            getMeetings(),

            getPayments({
              startDate: "2025-01-01",
              endDate: "2026-12-31",
            }),
          ]);

          const requests: Request[] =
            requestsData?.data ?? [];

          const meetings: Meeting[] =
            meetingsData ?? [];

          const payments: Payment[] =
            paymentsData ?? [];

          const approvedPayments =
            payments.filter(
              (p) =>
                p.status ===
                "approved",
            );

          const totalAmount =
            approvedPayments.reduce(
              (sum, p) =>
                sum +
                Number(p.amount),
              0,
            );

          const now = new Date();

          const thisMonth =
            now.getMonth();

          const thisYear =
            now.getFullYear();

          const paymentsThisMonth =
            approvedPayments.filter(
              (p) => {
                const d = new Date(
                  p.createdAt,
                );

                return (
                  d.getMonth() ===
                    thisMonth &&
                  d.getFullYear() ===
                    thisYear
                );
              },
            );

          setStats({
            users: usersData.total,

            requests:
              requests.filter(
                (r) =>
                  r.status !==
                  "confirmed",
              ).length,

            trainings:
              requests.filter(
                (r) =>
                  r.status ===
                  "confirmed",
              ).length,

            meetings:
              meetings.filter(
                (m) =>
                  m.status === 2,
              ).length,

            payments:
              paymentsThisMonth.length,

            paymentsAmount:
              totalAmount,
          });

          const upcoming =
            meetings
              .filter(
                (m) =>
                  m.status === 2 &&
                  new Date(
                    m.date,
                  ) >= now,
              )
              .sort(
                (a, b) =>
                  new Date(
                    a.date,
                  ).getTime() -
                  new Date(
                    b.date,
                  ).getTime(),
              )
              .slice(0, 3);

          setUpcomingMeetings(
            upcoming,
          );

          const latest = [
            ...requests,
          ]
            .sort(
              (a, b) =>
                new Date(
                  b.createdAt,
                ).getTime() -
                new Date(
                  a.createdAt,
                ).getTime(),
            )
            .slice(0, 3);

          setLatestRequests(
            latest,
          );
        } catch (error) {
          console.error(
            "Error cargando dashboard",
            error,
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-gray-400">
          Cargando dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            Dashboard
          </h1>

          <div className="h-0.5 w-16 bg-[#C7962D] mt-3" />

          <p className="text-gray-400 mt-4">
            Panel de administración
            de la plataforma.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            label="Usuarios"
            value={stats.users}
          />

          <StatCard
            label="Solicitudes"
            value={stats.requests}
          />

          <StatCard
            label="Capacitaciones confirmadas"
            value={stats.trainings}
          />

          <StatCard
            label="Reuniones pendientes"
            value={stats.meetings}
          />

          <StatCard
            label="Pagos este mes"
            value={stats.payments}
            sub={`$${stats.paymentsAmount.toLocaleString(
              "es-AR",
            )}`}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Próximas reuniones
              </h2>

              <div className="h-0.5 w-8 bg-[#C7962D] mt-2" />
            </div>

            {upcomingMeetings.length ===
            0 ? (
              <p className="text-gray-500 text-sm">
                No hay reuniones
                próximas.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingMeetings.map(
                  (m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">
                          {m.user
                            ?.companyName ||
                            m.user
                              ?.name ||
                            "Usuario"}
                        </p>

                        <p className="text-gray-400 text-xs mt-0.5">
                          {m
                            .trainingRequest
                            ?.training
                            ?.title ||
                            "Capacitación"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[#C7962D] text-sm">
                          {m.date}
                        </p>

                        <p className="text-gray-400 text-xs">
                          {m.time}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Últimas solicitudes
              </h2>

              <div className="h-0.5 w-8 bg-[#C7962D] mt-2" />
            </div>

            {latestRequests.length ===
            0 ? (
              <p className="text-gray-500 text-sm">
                No hay solicitudes
                recientes.
              </p>
            ) : (
              <div className="space-y-3">
                {latestRequests.map(
                  (r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">
                          {r.user
                            ?.companyName ||
                            r.user
                              ?.name ||
                            "Usuario"}
                        </p>

                        <p className="text-gray-400 text-xs mt-0.5">
                          {r.training
                            ?.title ||
                            "Capacitación"}
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          r.status
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-[#0B0D0F] border border-white/10 shadow-lg">
      <p className="text-gray-400 text-sm">
        {label}
      </p>

      <p className="text-3xl font-semibold text-white mt-2">
        {value}
      </p>

      {sub && (
        <p className="text-[#C7962D] text-sm mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const map: Record<
    string,
    {
      label: string;
      class: string;
    }
  > = {
    pending: {
      label: "Pendiente",

      class:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },

    scheduled: {
      label: "Agendada",

      class:
        "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },

    in_review: {
      label: "En revisión",

      class:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },

    confirmed: {
      label: "Confirmada",

      class:
        "bg-green-500/10 text-green-400 border-green-500/20",
    },

    awaiting_payment: {
      label:
        "Esperando pago",

      class:
        "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },

    cancelled: {
      label: "Cancelada",

      class:
        "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };

  const s = map[status] ?? {
    label: status,

    class:
      "bg-white/5 text-gray-400 border-white/10",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-lg border ${s.class}`}
    >
      {s.label}
    </span>
  );
}

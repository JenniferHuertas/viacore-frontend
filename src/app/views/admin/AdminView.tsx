"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import { getUsers } from "@/services/users.service";

import { getTrainingRequests } from "@/services/trainingRequests.service";

import { getAllTrainings } from "@/services/training.service";

type Training = {
  id: string;

  title: string;

  shortDescription: string;
};

export default function AdminView() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,

    requests: 0,

    trainings: 0,
  });

  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const [usersData, requests, trainingsData] = await Promise.all([
          getUsers(token),

          getTrainingRequests(token),

          getAllTrainings(),
        ]);

        const requestsArray = requests?.data ?? [];
        setStats({
          users: usersData.total,

          requests: requestsArray.filter((r: any) => r.status !== "confirmed").length,

          trainings: requestsArray.filter((req: any) => req.status === "confirmed").length,
        });

        setTrainings(trainingsData);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-gray-400">Cargando dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>

          <div className="h-0.5 w-16 bg-[#C7962D] mt-3" />

          <p className="text-gray-400 mt-4">
            Panel de administración de la plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B0D0F] border border-white/10 shadow-lg">
            <p className="text-gray-400 text-sm">Usuarios</p>

            <p className="text-3xl font-semibold text-white mt-2">
              {stats.users}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0D0F] border border-white/10 shadow-lg">
            <p className="text-gray-400 text-sm">Solicitudes</p>

            <p className="text-3xl font-semibold text-white mt-2">
              {stats.requests}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0D0F] border border-white/10 shadow-lg">
            <p className="text-gray-400 text-sm">Capacitaciones</p>

            <p className="text-3xl font-semibold text-white mt-2">
              {stats.trainings}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Gestionar capacitaciones
            </h2>

            <p className="text-gray-400 mt-2">
              Editá o eliminá las capacitaciones disponibles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trainings.map((training) => (
              <div
                key={training.id}
                className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {training.title}
                </h3>

                <p className="mt-3 text-sm text-gray-400">
                  {training.shortDescription}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href={`/admin/services/${training.id}/edit`}
                    className="text-sm text-[#C7962D] hover:underline cursor-pointer"
                  >
                    Editar
                  </Link>

                  <button className="text-sm text-red-400 hover:underline cursor-pointer">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

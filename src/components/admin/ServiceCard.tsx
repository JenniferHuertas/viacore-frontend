"use client";

import {
  useEffect,
  useState,
} from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import Link from "next/link";

import Image from "next/image";

import Button from "@/components/ui/Button";

import {
  deleteTraining,
  getAllTrainings,
} from "@/services/training.service";

type Training = {
  id: string;

  title: string;

  shortDescription: string;

  category?: string;

  fileResource?: {
    fileUrl: string;
  };
};

export default function ServicesView() {
  const [services, setServices] =
    useState<Training[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchServices =
    async () => {
      try {
        const data =
          await getAllTrainings();

        setServices(data);
      } catch (error) {
        console.error(
          "Error obteniendo servicios",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete =
    async (id: string) => {
      const confirmed =
        window.confirm(
          "¿Eliminar este servicio?",
        );

      if (!confirmed) return;

      try {
        const token =
          localStorage.getItem(
            "token",
          );

        if (!token) {
          alert(
            "Debes iniciar sesión",
          );

          return;
        }

        await deleteTraining(
          id,
          token,
        );

        setServices((prev) =>
          prev.filter(
            (service) =>
              service.id !== id,
          ),
        );

        alert(
          "Servicio eliminado correctamente",
        );
      } catch (error) {
        console.error(
          "Error eliminando servicio",
          error,
        );

        alert(
          "Error eliminando servicio",
        );
      }
    };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Servicios
            </h1>

            <div className="h-0.5 w-14 bg-[#C7962D] mt-3" />

            <p className="text-gray-400 mt-3">
              Gestión de capacitaciones disponibles.
            </p>
          </div>

          <Link href="/admin/services/create">
            <Button>
              + Crear servicio
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="border border-white/10 rounded-2xl bg-[#0B0D0F] p-10 text-gray-400">
            Cargando servicios...
          </div>
        ) : services.length === 0 ? (
          <div className="border border-white/10 rounded-2xl bg-[#0B0D0F] p-10">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium text-white">
                No hay servicios cargados
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                Creá el primer servicio para comenzar a gestionar capacitaciones.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl overflow-hidden border border-white/10 bg-[#0B0D0F] hover:border-[#C7962D]/40 transition flex flex-col"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={
                      service.fileResource
                        ?.fileUrl ||
                      "/images/placeholder.png"
                    }
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="p-5 space-y-4 flex flex-col flex-1">
                  <div>
                    {service.category && (
                      <span className="text-xs uppercase tracking-wider text-[#C7962D]">
                        {service.category}
                      </span>
                    )}

                    <h2 className="text-xl font-semibold text-white mt-2">
                      {service.title}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed flex-1">
                    {service.shortDescription}
                  </p>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      onClick={() =>
                        handleDelete(
                          service.id,
                        )
                      }
                      className="text-sm text-red-400 hover:text-red-300 transition cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
"use client";

import { useEffect, useState, useTransition } from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import Link from "next/link";

import Image from "next/image";

import Button from "@/components/ui/Button";

import { deleteTraining, getAllTrainings } from "@/services/training.service";

import { createPortal } from "react-dom";

import { toast as sonnerToast } from "sonner";

type Training = {
  id: string;

  title: string;

  shortDescription: string;

  category?: string;

  fileResource?: {
    fileUrl: string;
  };
};

type ConfirmModalProps = {
  serviceName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmDeleteModal({
  serviceName,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0B0D0F] border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-semibold text-white">
          ¿Eliminar servicio?
        </h2>
        <div className="h-0.5 w-10 bg-[#C7962D] mt-2 mb-4" />
        <p className="text-gray-400 text-sm">
          Estás por eliminar{" "}
          <span className="text-white font-medium">
            &quot;{serviceName}&quot;
          </span>
          . Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ServicesView() {
  const [services, setServices] = useState<Training[]>([]);

  const [loading, setLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [, startTransition] = useTransition();

  const fetchServices = async () => {
    try {
      const data = await getAllTrainings();
      startTransition(() => {
        setServices(data);
      });
    } catch (error) {
      console.error("Error obteniendo servicios", error);
    } finally {
      startTransition(() => {
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDeleteConfirmed = async () => {
    if (!confirmModal) return;
    const { id } = confirmModal;
    setConfirmModal(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        sonnerToast.error("Debés iniciar sesión");
        return;
      }

      await deleteTraining(id, token);
      setServices((prev) => prev.filter((s) => s.id !== id));
      sonnerToast.success("Servicio eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando servicio", error);
      sonnerToast.error("Error al eliminar el servicio");
    }
  };

  return (
    <AdminLayout>
      {confirmModal && (
        <ConfirmDeleteModal
          serviceName={confirmModal.title}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Servicios</h1>

            <div className="h-0.5 w-14 bg-[#C7962D] mt-3" />

            <p className="text-gray-400 mt-3">
              Gestión de capacitaciones disponibles.
            </p>
          </div>

          <Link href="/admin/services/create">
            <Button>+ Crear servicio</Button>
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
                Creá el primer servicio para comenzar a gestionar
                capacitaciones.
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
                      service.fileResource?.fileUrl || "/images/placeholder.png"
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

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/admin/services/edit/${service.id}`}
                      className="text-sm text-[#C7962D] hover:text-[#D7A53D] transition"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() =>
                        setConfirmModal({
                          id: service.id,
                          title: service.title,
                        })
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

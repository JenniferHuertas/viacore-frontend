"use client";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import AdminLayout from "@/components/admin/AdminLayout";

import Link from "next/link";

import { getTrainingRequestById } from "@/services/trainingRequests.service";

import { uploadFile } from "@/services/files.service";

type Request = {
  id: string;

  participantsCount: number;

  objectives: string;

  context: string;

  status:
    | "pending"
    | "in_review"
    | "scheduled"
    | "awaiting_payment"
    | "confirmed"
    | "cancelled";

  user?: {
    companyName?: string;
  };

  training?: {
    title?: string;
  };

  files?: {
    id: string;

    title?: string;

    fileUrl: string;
  }[];
};

export default function RequestDetailView({
  id,
}: {
  id: string;
}) {
  const [request, setRequest] =
    useState<Request | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [quotationFile, setQuotationFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token =
          localStorage.getItem(
            "token",
          );

        if (!token) return;

        const data =
          await getTrainingRequestById(
            id,
            token,
          );

        setRequest(data);
      } catch (error) {
        console.error(
          "Error obteniendo solicitud",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleUploadQuotation =
    async () => {
      if (
        !quotationFile ||
        !request
      ) {
        toast.warning(
          "Seleccioná un archivo",
        );

        return;
      }

      try {
        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          quotationFile,
        );

        await uploadFile(
          request.id,
          formData,
        );

        toast.success(
          "Cotización enviada correctamente",
        );

        setQuotationFile(
          null,
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Error enviando cotización",
        );
      } finally {
        setUploading(false);
      }
    };

  const getStatusLabel = (
    status: string,
  ) => {
    switch (status) {
      case "pending":
        return "Pendiente";

      case "in_review":
        return "En revisión";

      case "scheduled":
        return "Agendada";

      case "awaiting_payment":
        return "Esperando pago";

      case "confirmed":
        return "Confirmada";

      case "cancelled":
        return "Cancelada";

      default:
        return status;
    }
  };

  const getStatusColor = (
    status: string,
  ) => {
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
        return "text-gray-300";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-6 text-gray-400">
          Cargando solicitud...
        </div>
      </AdminLayout>
    );
  }

  if (!request) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          No se encontró la solicitud.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Detalle de solicitud
            </h1>

            <div className="h-0.5 w-14 bg-[#C7962D] mt-3" />
          </div>

          <Link href="/admin/requests">
            <button className="text-sm text-[#C7962D] hover:underline cursor-pointer">
              ← Volver
            </button>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-8 space-y-6">
          {request.training
            ?.title && (
            <div>
              <p className="text-sm text-gray-400">
                Capacitación
              </p>

              <p className="mt-1 text-xl font-medium text-white">
                {
                  request.training
                    .title
                }
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-400">
              Empresa
            </p>

            <p className="mt-1 text-lg font-medium text-white">
              {request.user
                ?.companyName ||
                "Empresa"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Participantes
            </p>

            <p className="mt-1 text-lg font-medium text-white">
              {
                request.participantsCount
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Estado
            </p>

            <p
              className={`mt-1 text-lg font-medium ${getStatusColor(
                request.status,
              )}`}
            >
              {getStatusLabel(
                request.status,
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Objetivos
            </p>

            <p className="mt-2 leading-relaxed text-gray-300">
              {request.objectives}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Contexto organizacional
            </p>

            <p className="mt-2 leading-relaxed text-gray-300">
              {request.context}
            </p>
          </div>

          {request.status ===
            "awaiting_payment" && (
              <div className="border-t border-white/10 pt-6 space-y-6">

                <div className="space-y-4 border-b border-white/10 pb-6">

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Enviar cotización
                    </h3>

                    <p className="text-sm text-gray-400 mt-2">
                      Adjuntá la cotización para que el cliente pueda verla y enviar el comprobante.
                    </p>
                  </div>

                  <input
                    type="file"
                    onChange={(e) =>
                      setQuotationFile(
                        e.target
                          .files?.[0] ??
                          null,
                      )
                    }
                    className="block w-full rounded-xl border border-white/10 bg-black p-3 text-sm text-gray-300"
                  />

                  <button
                    onClick={
                      handleUploadQuotation
                    }
                    disabled={
                      !quotationFile ||
                      uploading
                    }
                    className="w-fit rounded-xl bg-[#C7962D] px-6 py-3 font-semibold text-black hover:opacity-90 transition disabled:opacity-50"
                  >
                    {uploading
                      ? "Enviando..."
                      : "Enviar cotización"}
                  </button>

                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Archivos y comprobantes
                  </h2>

                  <p className="text-sm text-gray-400 mt-2">
                    Revisá los archivos enviados por el cliente.
                  </p>
                </div>

                {!request.files ||
                request.files.length ===
                  0 ? (
                  <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-gray-400">
                    No hay archivos cargados todavía.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {request.files.map(
                      (file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {file.title ||
                                "Archivo"}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Archivo adjunto
                            </p>
                          </div>

                          <a
                            href={
                              file.fileUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-[#C7962D]/30 px-4 py-2 text-sm text-[#C7962D] hover:bg-[#C7962D]/10 transition"
                          >
                            Ver archivo
                          </a>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
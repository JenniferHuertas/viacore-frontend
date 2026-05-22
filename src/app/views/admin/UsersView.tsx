"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import AdminLayout from "@/components/admin/AdminLayout";

import { getUsers, toggleUserStatus } from "@/services/users.service";

type User = {
  id: string;

  name?: string;

  email: string;

  role?: string;

  isActive?: boolean;
};

export default function UsersView() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [confirmModal, setConfirmModal] = useState<{
    userId: string;
    currentStatus: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const data = await getUsers(currentPage);

        const usersArray = data.data
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

        setUsers(usersArray);

        if (data.totalPages) {
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Error obteniendo usuarios", error);

        toast.error("Error obteniendo usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleToggleStatus = async (
    userId: string,

    currentStatus: boolean,
  ) => {
    try {
      await toggleUserStatus(userId, !currentStatus);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                isActive: !currentStatus,
              }
            : user,
        ),
      );

      toast.success(
        `Usuario ${!currentStatus ? "desbloqueado" : "bloqueado"} exitosamente`,
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario", error);

      toast.error("Error al actualizar el estado del usuario");
    }
  };

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="text-gray-400 animate-pulse">Cargando usuarios...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Usuarios</h1>

          <div className="h-0.5 w-12 bg-[#C7962D] mt-2" />

          <p className="text-gray-400 mt-2">Gestión de usuarios registrados.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="w-full text-sm min-w-200">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="text-left p-4">Nombre</th>

                <th className="text-left p-4">Email</th>

                <th className="text-left p-4">Rol</th>

                <th className="text-left p-4">Estado</th>

                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="p-4">{user.name || "Usuario sin nombre"}</td>

                  <td className="p-4 text-gray-400">{user.email}</td>

                  <td className="p-4 text-gray-300">
                    <span className="capitalize">{user.role || "user"}</span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        user.isActive !== false
                          ? "text-green-400 bg-green-500/10"
                          : "text-red-400 bg-red-500/10"
                      }`}
                    >
                      {user.isActive !== false ? "Activo" : "Bloqueado"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() =>
                        setConfirmModal({
                          userId: user.id,
                          currentStatus: user.isActive !== false,
                        })
                      }
                      className={`text-xs px-3 py-1.5 rounded transition cursor-pointer font-medium border ${
                        user.isActive !== false
                          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                      }`}
                    >
                      {user.isActive !== false ? "Bloquear" : "Desbloquear"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 p-4">
              <span className="text-sm text-gray-400">
                Página {currentPage} de {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="rounded bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Anterior
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded bg-[#C7962D] px-4 py-2 text-sm text-white transition hover:bg-[#b08426] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-2xl border border-white/10 bg-[#0B0D0F] p-8 space-y-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white">
              {confirmModal.currentStatus
                ? "¿Bloquear usuario?"
                : "¿Desbloquear usuario?"}
            </h2>
            <p className="text-gray-400 text-sm">
              {confirmModal.currentStatus
                ? "El usuario no podrá acceder a la plataforma. Podés revertir esta acción en cualquier momento."
                : "El usuario podrá volver a acceder a la plataforma."}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await handleToggleStatus(
                    confirmModal.userId,
                    confirmModal.currentStatus,
                  );
                  setConfirmModal(null);
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  confirmModal.currentStatus
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                }`}
              >
                {confirmModal.currentStatus
                  ? "Sí, bloquear"
                  : "Sí, desbloquear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

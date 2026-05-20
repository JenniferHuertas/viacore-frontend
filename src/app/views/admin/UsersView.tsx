"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getUsers,
  deactivateUser,
  toggleUserStatus,
} from "@/services/users.service";

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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await getUsers(token, currentPage);
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
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await toggleUserStatus(userId, !currentStatus, token);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: !currentStatus } : user,
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

  const handleDeactivate = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await deactivateUser(id, token);
      toast.success("Usuario bloqueado correctamente");
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isActive: false } : user,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error("Error bloqueando usuario");
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
          <table className="w-full text-sm min-w-[800px]">
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
                        handleToggleStatus(user.id, user.isActive !== false)
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
    </AdminLayout>
  );
}

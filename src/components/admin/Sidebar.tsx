"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();

  const linkClass = (path: string) => {
    const isActive =
      path === "/admin" ? pathname === path : pathname.startsWith(path);

    return `block px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-[#C7962D]/10 text-[#C7962D]"
        : "text-gray-300 hover:text-[#C7962D] hover:bg-white/5"
    }`;
  };

  const handleLogout = () => {
    document.cookie = "userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    logout();
    router.push("/");
  };

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-black/80 p-4 md:p-6 md:flex md:flex-col justify-between">
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-6">
          Admin Panel
        </h2>
        <div className="h-0.5 w-10 bg-[#C7962D] mb-3 hidden md:block md:mb-6" />

        <div className="overflow-x-auto -mx-4 px-4 md:overflow-visible md:mx-0 md:px-0">
          <nav className="flex flex-row md:flex-col gap-2 text-sm w-max md:w-auto">
            <Link href="/admin" className={linkClass("/admin")}>
              Dashboard
            </Link>
            <Link href="/admin/users" className={linkClass("/admin/users")}>
              Usuarios
            </Link>
            <Link href="/admin/services" className={linkClass("/admin/services")}>
              Servicios
            </Link>
            <Link href="/admin/requests" className={linkClass("/admin/requests")}>
              Solicitudes
            </Link>
            <Link href="/admin/meetings" className={linkClass("/admin/meetings")}>
              Reuniones
            </Link>
            <Link href="/admin/payments" className={linkClass("/admin/payments")}>
              Pagos
            </Link>
          </nav>
        </div>
      </div>

      <div className="hidden md:block space-y-4">
        <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
          <Link
            href="/plataforma"
            className="block px-3 py-2 text-gray-400 hover:text-white transition"
          >
            ← Volver al sitio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
   
        <div className="text-sm text-gray-500 px-3">Admin v1.0</div>
      </div>
    </aside>
  );
}
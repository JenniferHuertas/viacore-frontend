"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { useUser } from "@/hooks/useUser";
import DropdownNotificaciones from "@/components/notifications/DropdownNotificaciones";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/autenticacion");
  
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, user } = useUser();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const handleLogout = () => {
    document.cookie = "userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    logout();
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = () => setOpen(false);
    
    setTimeout(() => document.addEventListener("click", handleClickOutside), 0);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#070707]/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-8">
   
        <Link href="/" className="flex items-center gap-4 shrink-0">
          <img src="/images/logo.png" alt="Viacore" className="h-9" />
          <span className="text-sm font-semibold text-white">VIACORE</span>
        </Link>
        
        {!isAuthPage && (
          <>
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-8 text-sm text-gray-200">
              <Link href="/plataforma" className="hover:text-white transition">
                Plataforma
              </Link>
              <Link href="/mis-solicitudes" className="hover:text-white transition">
                Mis solicitudes
              </Link>
              <Link href="/contacto" className="hover:text-white transition">
                Contacto
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/requests"
                  className="text-[#C7962D] hover:text-white transition font-medium"
                >
                  Admin
                </Link>
              )}
            </nav>

            <button
              onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
              className="lg:hidden text-white text-2xl ml-auto"
            >
              ☰
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 shrink-0">
                <DropdownNotificaciones />

                <div className="hidden md:flex flex-col items-end w-40 overflow-hidden">
                  <span className="text-xs text-gray-500">Conectado como</span>
                  <span className="text-sm text-white font-medium truncate w-full text-right">
                    {user?.email}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:block px-5 py-2 rounded-md text-sm font-semibold border border-[#C7962D] text-[#C7962D] hover:bg-[#C7962D] hover:text-black transition cursor-pointer whitespace-nowrap"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                href="/autenticacion"
                className="hidden lg:block px-5 py-2 rounded-md text-sm font-semibold bg-[#C7962D] text-black hover:opacity-90 transition"
              >
                Ingresar
              </Link>
            )}
          </>
        )}
      </div>
      
      {open && !isAuthPage && (
        <div 
          className="lg:hidden bg-[#070707] border-t border-white/10 flex flex-col px-6 py-6 gap-4 text-sm text-gray-200 relative z-50"
          onClick={(e) => e.stopPropagation()} 
        >
          <Link href="/plataforma" onClick={() => setOpen(false)} className="hover:text-white transition">
            Plataforma
          </Link>
          <Link href="/mis-solicitudes" onClick={() => setOpen(false)} className="hover:text-white transition">
            Mis solicitudes
          </Link>
          <Link href="/contacto" onClick={() => setOpen(false)} className="hover:text-white transition">
            Contacto
          </Link>
          
          {isAdmin && (
            <Link href="/admin/requests" onClick={() => setOpen(false)} className="text-[#C7962D] font-medium">
              Admin
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <div className="mt-4 flex flex-col text-sm">
                <span className="text-gray-500">Conectado como</span>
                <span className="text-white font-medium break-all">
                  {user?.email}
                </span>
              </div>
              
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="mt-2 px-5 py-3 rounded-md text-center font-semibold border border-[#C7962D] text-[#C7962D] hover:bg-[#C7962D] hover:text-black cursor-pointer"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/autenticacion"
              onClick={() => setOpen(false)}
              className="mt-4 px-5 py-3 rounded-md text-center font-semibold bg-[#C7962D] text-black hover:opacity-90 transition"
            >
              Ingresar
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
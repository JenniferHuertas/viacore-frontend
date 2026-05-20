"use client";

import Sidebar from "./Sidebar";

import DropdownNotificaciones from "@/components/notifications/DropdownNotificaciones";

export default function AdminLayout({
  children,
}: any) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#070707] text-white">

      <Sidebar />

      <main className="flex-1 p-4 md:p-10">

        <div className="mb-6 flex items-center justify-end">
          <DropdownNotificaciones />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-sm">
          {children}
        </div>

      </main>

    </div>
  );
}
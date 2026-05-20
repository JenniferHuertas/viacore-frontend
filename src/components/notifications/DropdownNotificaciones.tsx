"use client";

import { useState } from "react";

import { useNotifications } from "@/context/NotificationContext";

import ItemNotificacion from "./ItemNotificacion";

import { useUserContext } from "@/context/UserContext";

export default function DropdownNotificaciones() {

  const {isProfileCompleted} = useUserContext();

  const [abierto, setAbierto] = useState(false);

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  if (isProfileCompleted) {

  return (
    <div className="relative shrink-0">

      <button
        onClick={() =>
          setAbierto(!abierto)
        }
        className="relative px-3 py-2 rounded-md border border-white/10 text-sm text-white hover:text-[#C7962D] hover:border-[#C7962D]/50 transition cursor-pointer"
      >

        Notificaciones

        {unreadCount > 0 && (

          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#C7962D] px-2 py-0.5 text-xs font-bold text-black">

            {unreadCount}

          </span>

        )}

      </button>

      {abierto && (

        <div className="absolute right-0 mt-4 w-96 rounded-2xl border border-white/10 bg-[#0B0D0F] shadow-2xl p-4 z-50">

          <div className="flex items-center justify-between mb-4">
           
            <h3 className="text-sm font-semibold text-white">
              Notificaciones
            </h3>

          {notifications.length > 0 &&

            <button
              onClick={
                markAllAsRead
              }
              className="text-xs text-[#C7962D] hover:text-white transition cursor-pointer"
            >
              Marcar todas
            </button>
          }

          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">

            {notifications.length === 0 ? (

              <div className="text-sm text-gray-500">
                No hay notificaciones
              </div>

            ) : (

              notifications.map(
                (notification) => (

                  <ItemNotificacion
                    key={notification.id}
                    notification={notification}
                    onRead={() => markAsRead(notification.id)}
                  />

                ),
              )

            )}

          </div>

        </div>

      )}

    </div>
  );
 }
}

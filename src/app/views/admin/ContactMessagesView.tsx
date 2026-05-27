"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import { getContactMessages } from "@/services/contact.service";

import { toast } from "sonner";

type ContactMessage = {
  id: string;

  nombre: string;

  email: string;

  empresa?: string;

  mensaje: string;

  createdAt: string;
};

export default function ContactMessagesView() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();

      setMessages(data);
    } catch (error) {
      console.error(error);

      toast.error("Error obteniendo mensajes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-gray-400">Cargando mensajes...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contacto</h1>

          <div className="h-0.5 w-12 bg-[#C7962D] mt-2" />

          <p className="text-gray-400 mt-2">
            Consultas recibidas desde la plataforma.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="text-left p-4">Nombre</th>

                <th className="text-left p-4">Email</th>

                <th className="text-left p-4">Empresa</th>

                <th className="text-left p-4">Mensaje</th>

                <th className="text-left p-4">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="border-b border-white/5">
                  <td className="p-4">{message.nombre}</td>

                  <td className="p-4 text-gray-400">{message.email}</td>

                  <td className="p-4 text-gray-400">
                    {message.empresa || "-"}
                  </td>

                  <td className="p-4 max-w-xs break-words text-gray-300">
                    {message.mensaje}
                  </td>

                  <td className="p-4 text-gray-400">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

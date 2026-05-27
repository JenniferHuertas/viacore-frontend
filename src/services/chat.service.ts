import { api } from "./api";

export type ChatMessage = {
  id: string;
  message: string;
  role: "user" | "assistant" | "admin";
  isAiGenerated: boolean;
  createdAt: string;
  sessionId?: string;
};

type SendMessagePayload = {
  message: string;
  sessionId: string;
  trainingRequestId?: string;
  userId?: string; // Lo mantenemos aquí para que tu componente de React no proteste
};

export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<ChatMessage> => {

  // FILTRADO TOTAL: Eliminamos "userId" por completo y limpiamos datos vacíos
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([key, value]) => 
        key !== "userId" && // <--- ¡EL ESCUDO!: Si viene el userId, lo deséchamos aquí mismo
        value !== undefined && 
        value !== null && 
        value !== "" && 
        value !== "undefined"
    )
  );

  // PETICIÓN NATIVA SEGURA
  const response = await fetch(${process.env.NEXT_PUBLIC_API_URL}/chat, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanPayload), // Enviamos los datos purificados sin el intruso
    credentials: "include", // Permite que viaje la cookie para que el backend te reconozca
  });

  if (!response.ok) {
    throw new Error("No se pudo enviar el mensaje");
  }

  return response.json();
};

export const getChatHistory = async (
  identifier: string,
): Promise<ChatMessage[]> => {

  return await api(
    /chat/history/${identifier},
    {
      method: "GET",
    },
  );
};

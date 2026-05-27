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
  userId?: string;
};

export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<ChatMessage> => {
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([key, value]) =>
        key !== "userId" &&
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "undefined"
    )
  );

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanPayload),
    credentials: "include",
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
    `/chat/history/${identifier}`,
    {
      method: "GET",
    },
  );
};

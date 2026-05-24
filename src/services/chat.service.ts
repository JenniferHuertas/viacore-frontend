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
};

export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<ChatMessage> => {

  return await api("/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
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
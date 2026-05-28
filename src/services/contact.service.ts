import { api } from "./api";

type ContactPayload = {
  nombre: string;
  email: string;
  empresa?: string;
  mensaje: string;
};

// POST /contact → público, no necesita proxy
export const sendContactMessage = async (
  payload: ContactPayload,
) => {
  return await api("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

// GET /contact → protegido (admin), pasa por proxy
export const getContactMessages = async () => {
  return await api("/api/contact", {
    method: "GET",
  });
};

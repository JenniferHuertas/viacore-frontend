import { api } from "./api";

export const getAllPayments = async (token: string) => {
  return await api("/payments", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

import { api } from "./api";

export const getAllPayments = async () => {
  return await api("/payments", { method: "GET" });
};

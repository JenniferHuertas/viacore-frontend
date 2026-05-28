import { api } from "./api";

export const uploadFile = (formData: FormData) => {
  return api("/api/files/upload", {
    method: "POST",
    body: formData,
  });
};

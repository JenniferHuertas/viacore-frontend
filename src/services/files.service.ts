import { api } from "./api";

export const uploadFile =
  (
    requestId: string,

    formData: FormData,
  ) => {

    return api(
      `/api/files/upload`,
      {
        method: "POST",

        body: formData,
      },
    );
  };

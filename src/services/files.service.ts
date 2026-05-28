import { api } from "./api";

export const uploadFile =
  (
    requestId: string,

    formData: FormData,
  ) => {

    return api(
      `/api/upload-evidence`,
      {
        method: "POST",

        body: formData,
      },
    );
  };

import { api } from "./api";

export const uploadFile =
  (
    requestId: string,

    formData: FormData,
  ) => {

    return api(
      `/training-requests/${requestId}/upload-evidence`,
      {
        method: "POST",

        body: formData,
      },
    );
  };
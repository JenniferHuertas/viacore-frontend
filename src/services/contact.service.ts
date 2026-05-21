import { api } from "./api";

type ContactPayload = {
  nombre: string;

  email: string;

  empresa?: string;

  mensaje: string;
};

export const sendContactMessage =
  async (
    payload: ContactPayload,
  ) => {

    return await api(
      "/contact",
      {
        method: "POST",

        body: JSON.stringify(
          payload,
        ),
      },
    );
  };

export const getContactMessages =
  async () => {

    return await api(
      "/contact",
      {
        method: "GET",
      },
    );
  };
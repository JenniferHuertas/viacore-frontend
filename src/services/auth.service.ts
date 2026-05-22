import { api } from "./api";

export const registerUser = (
  payload: any,
) => {
  return api("/auth/signup", {
    method: "POST",

    body: JSON.stringify(
      payload,
    ),
  });
};

export const loginUser = (
  payload: {
    email: string;
    password: string;
  },
) => {
  return api("/auth/signin", {
    method: "POST",

    body: JSON.stringify(
      payload,
    ),
  });
};

export const completeProfile =
  async (
    payload: {
      phone: string;
      country: string;
      companyName: string;
      city: string;
      address: string;
    },
  ) => {

    return api(
      "/users/complete-profile",
      {
        method: "PATCH",

        body: JSON.stringify(
          payload,
        ),
      },
    );
  };
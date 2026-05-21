import { api } from "./api";

export const getUsers =
  async (
    page: number = 1,
  ) => {

    return await api(
      `/users?page=${page}&limit=5`,
      {
        method: "GET",
      },
    );
  };

export const toggleUserStatus =
  async (
    userId: string,

    isActive: boolean,
  ) => {

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          method: "PUT",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            { isActive },
          ),
        },
      );

    if (!response.ok) {

      throw new Error(
        "Error al actualizar el estado del usuario",
      );
    }

    return response.json();
  };

export const deactivateUser =
  async (
    id: string,
  ) => {

    return await api(
      `/users/${id}`,
      {
        method: "DELETE",
      },
    );
  };
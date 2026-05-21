import {
  TrainingCard,
  TrainingDetail,
} from "@/types/training";

import { api } from "./api";

export const getAllTrainings =
  (
    ...params: string[]
  ): Promise<TrainingCard[]> => {

    return fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/trainings${
        params.length
          ? params
              .map(
                (p) => "?" + p,
              )
              .join("&")
          : ""
      }`,
      {
        method: "GET",

        cache: "no-store",
      },
    ).then((res) => {

      if (!res.ok) {

        throw new Error(
          "Error obteniendo trainings",
        );
      }

      return res.json();
    });
  };

export const getTrainingById = (
  id: string,
): Promise<TrainingDetail> => {

  return api(
    `/trainings/${id}`,
    {
      method: "GET",
    },
  );
};

export const createTraining =
  async (
    formData: FormData,
  ) => {

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trainings`,
        {
          method: "POST",

          credentials:
            "include",

          body: formData,
        },
      );

    if (!response.ok) {

      throw await response.json();
    }

    return response.json();
  };

export const updateTraining =
  async (
    id: string,

    formData: FormData,
  ) => {

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trainings/${id}`,
        {
          method: "PATCH",

          credentials:
            "include",

          body: formData,
        },
      );

    if (!response.ok) {

      throw await response.json();
    }

    return response.json();
  };

export const deleteTraining =
  async (
    id: string,
  ) => {

    return api(
      `/trainings/${id}`,
      {
        method: "DELETE",
      },
    );
  };
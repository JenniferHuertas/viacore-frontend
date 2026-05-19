import { TrainingCard, TrainingDetail } from "@/types/training";

import { api } from "./api";

export const getAllTrainings = (): Promise<TrainingCard[]> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainings`, {
    cache: "no-store",
  }).then((res) => res.json());
};

export const getTrainingById = (id: string): Promise<TrainingDetail> => {
  return api(`/trainings/${id}`, {
    method: "GET",
  });
};

export const createTraining = async (formData: FormData, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainings`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};

export const updateTraining = async (
  id: string,
  formData: FormData,
  token: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trainings/${id}`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    },
  );

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};

export const deleteTraining = async (id: string, token: string) => {
  return api(`/trainings/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

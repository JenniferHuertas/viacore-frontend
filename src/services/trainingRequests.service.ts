import { api } from "./api";

export const getTrainingRequests =
  async (
    page: number = 1,
    limit: number = 10,
  ) => {

    return await api(
      `/training-requests?page=${page}&limit=${limit}`,
      {
        method: "GET",
      },
    );
  };

export const getMyTrainingRequests = async () => {
  const res = await api("/training-requests/me", { method: "GET" });
  return res.data ?? [];

export const getTrainingRequestById =
  async (
    id: string,
  ) => {

    return await api(
      `/training-requests/${id}`,
      {
        method: "GET",
      },
    );
  };

export const createTrainingRequest =
  async (
    payload: {
      trainingId: string;
      participantsCount: number;
      objectives: string;
      context: string;
    },
  ) => {

    return await api(
      "/training-requests",
      {
        method: "POST",

        body: JSON.stringify(
          payload,
        ),
      },
    );
  };

export const editTrainingRequest =
  async (
    id: string,

    payload: {
      participantsCount: number;
      objectives: string;
      context: string;
    },
  ) => {

    return await api(
      `/training-requests/${id}`,
      {
        method: "PATCH",

        body: JSON.stringify(
          payload,
        ),
      },
    );
  };

export const updateTrainingRequest =
  async (
    id: string,

    payload: {
      status: string;
    },
  ) => {

    return await api(
      `/training-requests/${id}/status`,
      {
        method: "PATCH",

        body: JSON.stringify(
          payload,
        ),
      },
    );
  };

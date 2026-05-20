import { api } from "./api";

export interface TrainingRequestPayload {
  trainingId?: string;
  participantsCount: number;
  objectives: string;
  context: string;
}

export const getTrainingRequests = async (
  token: string,
  page: number = 1,
  limit: number = 10
) => {
  return await api(`/training-requests?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyTrainingRequests = async (
  token: string,
  page: number = 1,
  limit: number = 10
) => {
  const response = await api(`/training-requests/me?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response?.data || response; 
};

export const getTrainingRequestById = async (
  id: string,
  token: string,
) => {
  return await api(`/training-requests/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createTrainingRequest = async (
  payload: Required<Pick<TrainingRequestPayload, "trainingId" | "participantsCount" | "objectives" | "context">>,
  token: string,
) => {
  return await api("/training-requests", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};

export const editTrainingRequest = async (
  id: string,
  payload: Omit<TrainingRequestPayload, "trainingId">,
  token: string,
) => {
  return await api(`/training-requests/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};

export const updateTrainingRequest = async (
  id: string,
  payload: {
    status: string;
  },
  token: string,
) => {
  return await api(`/training-requests/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};
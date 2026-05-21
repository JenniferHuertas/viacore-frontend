import { api } from "./api";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  country?: string | null;
  companyName?: string | null;
  city?: string | null;
  address?: string | null;
  profileCompleted: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  country?: string;
  companyName?: string;
  city?: string;
  address?: string;
};

export const getMyProfile = (): Promise<Profile> => {
  return api("/profile/me", {
    method: "GET",
  });
};

export const updateMyProfile = (
  payload: UpdateProfilePayload,
): Promise<Profile> => {
  return api("/profile/me", {
    method: "PATCH",

    body: JSON.stringify(payload),
  });
};
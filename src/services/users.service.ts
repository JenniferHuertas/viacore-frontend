import { api } from "./api";
 
export const getUsers = async (
  page: number = 1,
) => {
  return await api(
    `/api/users?page=${page}&limit=5`,
    {
      method: "GET",
    },
  );
};
 
export const toggleUserStatus = async (
  userId: string,
  isActive: boolean,
) => {
  return await api(
    `/api/users/${userId}`,
    {
      method: "PUT",
      body: { isActive },
    },
  );
};
 
export const deactivateUser = async (
  id: string,
) => {
  return await api(
    `/api/users/${id}`,
    {
      method: "DELETE",
    },
  );
};

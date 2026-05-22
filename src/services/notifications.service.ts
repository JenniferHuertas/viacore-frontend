import { api } from "./api";

export const getNotificationsByUser =
  (
    userId: string,
  ) => {

    return api(
      `/notifications/user/${userId}`,
      {
        method: "GET",
      },
    );
  };

export const getUnreadNotifications =
  (
    userId: string,
  ) => {

    return api(
      `/notifications/user/${userId}/unread`,
      {
        method: "GET",
      },
    );
  };

export const getUnreadCount =
  (
    userId: string,
  ) => {

    return api(
      `/notifications/user/${userId}/count`,
      {
        method: "GET",
      },
    );
  };

export const markAsRead =
  (
    notificationId: string,
  ) => {

    return api(
      `/notifications/${notificationId}/read`,
      {
        method: "PATCH",
      },
    );
  };

export const markAllAsRead =
  (
    userId: string,
  ) => {

    return api(
      `/notifications/user/${userId}/read-all`,
      {
        method: "PATCH",
      },
    );
  };
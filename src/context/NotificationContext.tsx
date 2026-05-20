"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "sonner";

import {
  getNotificationsByUser,
  getUnreadCount,
  markAllAsRead as markAllNotifications,
  markAsRead as markNotificationAsRead,
} from "@/services/notifications.service";

import { socket } from "@/lib/socket";

import { useUserContext } from "@/context/UserContext";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationContext =
  createContext<NotificationContextType | undefined>(
    undefined,
  );

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const previousNotificationIds =
    useRef<string[]>([]);

  const { user, isHydrated } =
    useUserContext();

  const fetchNotifications =
    async () => {
      try {
        if (!user?.id) return;

        const [
          notificationsData,
          unreadData,
        ] = await Promise.all([
          getNotificationsByUser(user.id),
          getUnreadCount(user.id),
        ]);

        setNotifications(
          notificationsData,
        );

        setUnreadCount(
          unreadData,
        );
      } catch (error) {
        console.error(
          "Error loading notifications",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

  const markAsRead =
    async (
      notificationId: string,
    ) => {
      try {
        await markNotificationAsRead(
          notificationId,
        );

        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id ===
            notificationId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification,
          ),
        );

        setUnreadCount((prev) =>
          prev > 0 ? prev - 1 : 0,
        );
      } catch (error) {
        console.error(
          "Error marking notification as read",
          error,
        );
      }
    };

  const markAllAsRead =
    async () => {
      try {
        if (!user?.id) return;

        await markAllNotifications(
          user.id,
        );

        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        );

        setUnreadCount(0);
      } catch (error) {
        console.error(
          "Error marking all notifications as read",
          error,
        );
      }
    };

  useEffect(() => {
    if (
      !isHydrated ||
      !user?.id
    ) {
      setLoading(false);
      return;
    }

    fetchNotifications();
  }, [isHydrated, user]);

  useEffect(() => {
    console.log(
      "SOCKET EFFECT",
      {
        userId: user?.id,
        socketId: socket.id,
        connected: socket.connected,
      },
    );

    if (
      !isHydrated ||
      !user?.id
    ) {
      return;
    }

    const handleConnect = () => {
      console.log(
        "JOIN ROOM",
        user.id,
      );

      socket.emit(
        "join",
        user.id,
      );
    };

    const handleNewNotification = (
      notification: Notification,
    ) => {
      console.log(
        "NOTIFICATION RECEIVED",
        notification,
      );

      setNotifications((prev) => {
        const exists =
          prev.some(
            (item) =>
              item.id ===
              notification.id,
          );

        if (exists) return prev;

        return [
          {
            id:
              notification.id ||
              crypto.randomUUID(),

            title:
              notification.title,

            message:
              notification.message,

            type:
              notification.type,

            isRead:
              notification.isRead ??
              false,

            createdAt:
              notification.createdAt ||
              new Date().toISOString(),
          },

          ...prev,
        ];
      });

      setUnreadCount(
        (prev) => prev + 1,
      );
    };

    socket.on(
      "connect",
      handleConnect,
    );

    socket.on(
      "notification:new",
      handleNewNotification,
    );

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      console.log(
        "SOCKET CLEANUP",
      );

      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "notification:new",
        handleNewNotification,
      );
    };
  }, [isHydrated, user]);

  useEffect(() => {
    if (
      previousNotificationIds.current
        .length === 0
    ) {
      previousNotificationIds.current =
        notifications.map(
          (notification) =>
            notification.id,
        );

      return;
    }

    const newNotifications =
      notifications.filter(
        (notification) =>
          !previousNotificationIds.current.includes(
            notification.id,
          ),
      );

    newNotifications.forEach(
      (notification) => {
        toast.success(
          notification.title,
          {
            description:
              notification.message,
          },
        );
      },
    );

    previousNotificationIds.current =
      notifications.map(
        (notification) =>
          notification.id,
      );
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications =
  () => {
    const context =
      useContext(
        NotificationContext,
      );

    if (!context) {
      throw new Error(
        "useNotifications must be used within NotificationProvider",
      );
    }

    return context;
  };
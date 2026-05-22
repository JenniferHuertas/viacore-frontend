"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { api } from "@/services/api";

export type User = {
  id: string;
  email: string;
  role: string;
  profileCompleted: boolean;
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isProfileCompleted: boolean;
  isHydrated: boolean;

  login: () => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<User | null>;
};

const UserContext =
  createContext<UserContextType | undefined>(
    undefined,
  );

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  const [isHydrated, setIsHydrated] =
    useState(false);

  const router = useRouter();

  const refreshUser =
    async (): Promise<User | null> => {

      try {

        const profile =
          await api("/auth/profile", {
            method: "GET",

            headers: {
              "Cache-Control": "no-cache",
            },
          });

        setUser(profile);

        return profile;

} catch (error: any) {

  if (
    error?.statusCode === 401
  ) {

    setUser(null);

    return null;
  }

  console.error(
    "ERROR REFRESH USER",
    {
      statusCode:
        error?.statusCode,

      message:
        error?.message,

      error,
    },
  );

  return null;
}

       finally {

        setIsHydrated(true);

      }
    };

  useEffect(() => {

    refreshUser();

  }, []);

  const login =
    async () => {

      await refreshUser();

    };

  const logout =
    async () => {

      try {

        await api(
          "/auth/logout",
          {
            method: "POST",
          },
        );

      } catch (error) {

        console.error(error);

      } finally {

        setUser(null);

        router.push("/");

        toast.success(
          "Sesión cerrada exitosamente",
        );
      }
    };

  return (
    <UserContext.Provider
      value={{

        user,

        isAuthenticated:
          !!user,

        isProfileCompleted:
          !!user?.profileCompleted,

        isHydrated,

        login,

        logout,

        refreshUser,

      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {

  const context =
    useContext(
      UserContext,
    );

  if (!context) {

    throw new Error(
      "useUserContext debe usarse dentro de UserProvider",
    );
  }

  return context;
}

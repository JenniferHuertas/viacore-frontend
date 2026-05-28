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
  createContext<
    UserContextType | undefined
  >(undefined);

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

  // =========================
  // REFRESH USER
  // =========================

  const refreshUser =
    async (): Promise<User | null> => {

      try {

        const profile =
          await api(
            "/auth/profile",
            {
              method: "GET",

              headers: {
                "Cache-Control":
                  "no-cache",
              },

              credentials:
                "include",
            },
          );

        setUser(profile);

        return profile;

      } catch (error: any) {

        // 🔥 401 NORMAL
        // NO romper auth flow
        if (
          error?.statusCode ===
          401
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

      } finally {

        setIsHydrated(true);
      }
    };

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {

    const currentPath =
      window.location.pathname;

    const isAuthFlow =
      currentPath.startsWith(
        "/autenticacion",
      );

    // 🔥 IMPORTANTE
    // evitar doble refresh
    // durante login Google
    if (isAuthFlow) {

      setIsHydrated(true);

      return;
    }

    refreshUser();

  }, []);

  // =========================
  // ONBOARDING
  // =========================

  useEffect(() => {

    if (
      !isHydrated ||
      !user
    ) return;

    const isAdmin =
      user.role === "Admin";

    const isProfileCompleted =
      user.profileCompleted;

    const currentPath =
      window.location.pathname;

    const isOnboardingPage =
      currentPath.startsWith(
        "/completar-perfil",
      );

    // =========================
    // FORCE ONBOARDING
    // =========================

    if (
      !isAdmin &&
      !isProfileCompleted &&
      !isOnboardingPage
    ) {

      toast.warning(
        "Debes completar tu perfil para continuar.",
      );

      router.replace(
        "/completar-perfil",
      );

      return;
    }

    // =========================
    // EXIT ONBOARDING
    // =========================

    if (
      isProfileCompleted &&
      isOnboardingPage
    ) {

      router.replace("/");

      return;
    }

  }, [
    user,
    isHydrated,
    router,
  ]);

  // =========================
  // LOGIN
  // =========================

  const login =
    async () => {

      await refreshUser();
    };

  // =========================
  // LOGOUT
  // =========================

  const logout =
    async () => {

      try {

        await api(
          "/auth/logout",
          {
            method: "POST",

            credentials:
              "include",
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
    useContext(UserContext);

  if (!context) {

    throw new Error(
      "useUserContext debe usarse dentro de UserProvider",
    );
  }

  return context;
}

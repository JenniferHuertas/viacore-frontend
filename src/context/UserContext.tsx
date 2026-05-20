"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { jwtDecode } from "jwt-decode";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

export type DecodedToken = {
  id: string;

  email: string;

  role: string;

  profileCompleted: boolean;
};

type UserContextType = {
  token: string | null;

  user: DecodedToken | null;

  isAuthenticated: boolean;

  isProfileCompleted: boolean;

  isHydrated: boolean;

  login: (token: string) => void;

  logout: () => void;
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
  const [token, setToken] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<DecodedToken | null>(
      null,
    );

  const router = useRouter();

  const [
    isHydrated,
    setIsHydrated,
  ] = useState(false);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token");

    if (!storedToken) {
      setIsHydrated(true);

      return;
    }

    try {
      if (
        storedToken.split(".")
          .length !== 3
      ) {
        throw new Error(
          "Token inválido",
        );
      }

      setToken(storedToken);

      const decoded =
        jwtDecode<DecodedToken>(
          storedToken,
        );

      setUser(decoded);

      localStorage.setItem(
        "user",
        JSON.stringify(decoded),
      );
    } catch (err) {
      localStorage.removeItem(
        "token",
      );

      localStorage.removeItem(
        "user",
      );

      setToken(null);

      setUser(null);
    }

    setIsHydrated(true);
  }, []);

  const login = (
    newToken: string,
  ) => {
    try {
      localStorage.setItem(
        "token",
        newToken,
      );

      document.cookie = `userSession=${newToken}; path=/; max-age=86400`;

    setToken(newToken);

      const decoded =
        jwtDecode<DecodedToken>(
          newToken,
        );

      localStorage.setItem(
        "user",
        JSON.stringify(decoded),
      );

      setUser(decoded);
    } catch (error) {
      toast.error(
        "Token inválido",
      );
    }
  };

  const logout = () => {
    localStorage.removeItem(
      "token",
    );

    localStorage.removeItem(
      "user",
    );

    document.cookie =
      "userSession=; path=/; max-age=0";

    setToken(null);

    setUser(null);

    router.push("/");

    toast.success(
      "Sesión cerrada exitosamente",
    );
  };

  return (
    <UserContext.Provider
      value={{
        token,

        user,

        isAuthenticated:
          !!token,

        isProfileCompleted:
          !!user?.profileCompleted,

        isHydrated,

        login,

        logout,
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

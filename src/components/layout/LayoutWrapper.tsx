"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";

import Footer from "./Footer";

import { useUserContext } from "@/context/UserContext";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname =
    usePathname();

  const {
    user,
    isHydrated,
  } = useUserContext();

  const isAdminRoute =
    pathname.startsWith("/admin");

  const isCompletingProfile =
    pathname.startsWith(
      "/completar-perfil",
    );

  const isAdmin =
    user?.role === "Admin";

  const shouldHideLayout =
    isHydrated &&
    user &&
    !isAdmin &&
    !user.profileCompleted &&
    isCompletingProfile;

  return (
    <>
      {!isAdminRoute &&
        !shouldHideLayout && (
          <Navbar />
        )}

      <main
        className={
          !isAdminRoute &&
          !shouldHideLayout
            ? "pt-16 flex-1"
            : "flex-1"
        }
      >
        {children}
      </main>

      {!isAdminRoute &&
        !shouldHideLayout && (
          <Footer />
        )}
    </>
  );
}
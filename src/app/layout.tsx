import "./globals.css";

import { UserProvider } from "@/context/UserContext";

import { NotificationProvider } from "@/context/NotificationContext";

import LayoutWrapper from "@/components/layout/LayoutWrapper";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">

      <body className="bg-[#070707] text-white flex flex-col min-h-screen">

        <UserProvider>

          <NotificationProvider>

            <LayoutWrapper>
              {children}
            </LayoutWrapper>

          </NotificationProvider>

        </UserProvider>

        <Toaster richColors duration={10000} />

      </body>

    </html>
  );
}
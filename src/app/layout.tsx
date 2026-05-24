import "./globals.css";

import { Toaster } from "sonner";

import { UserProvider } from "@/context/UserContext";

import { ChatProvider } from "@/context/ChatContext";

import { NotificationProvider } from "@/context/NotificationContext";

import LayoutWrapper from "@/components/layout/LayoutWrapper";

import ChatWidget from "@/components/chat/ChatWidget";

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

            <ChatProvider>

              <LayoutWrapper>

                {children}

                <ChatWidget />

              </LayoutWrapper>

            </ChatProvider>

          </NotificationProvider>

        </UserProvider>

        <Toaster
          richColors
          duration={10000}
        />

      </body>

    </html>
  );
}
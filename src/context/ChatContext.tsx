"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type ChatContextType = {
  trainingRequestId?: string;

  setTrainingRequestId: (
    id?: string,
  ) => void;
};

const ChatContext =
  createContext<
    ChatContextType | undefined
  >(undefined);

export function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    trainingRequestId,
    setTrainingRequestId,
  ] = useState<
    string | undefined
  >();

  return (
    <ChatContext.Provider
      value={{
        trainingRequestId,
        setTrainingRequestId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {

  const context =
    useContext(ChatContext);

  if (!context) {

    throw new Error(
      "useChatContext debe usarse dentro de ChatProvider",
    );
  }

  return context;
}
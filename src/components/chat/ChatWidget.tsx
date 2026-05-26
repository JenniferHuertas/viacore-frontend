"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Bot,
  X,
} from "lucide-react";

import ChatHeader from "./ChatHeader";

import ChatMessage from "./ChatMessage";

import ChatInput from "./ChatInput";

import TypingIndicator from "./TypingIndicator";

import ChatSuggestions from "./ChatSuggestions";

import {
  useChatContext,
} from "@/context/ChatContext";

import {
  useUserContext,
} from "@/context/UserContext";

import {
  getChatHistory,
  sendMessage,
  type ChatMessage as ChatMessageType,
} from "@/services/chat.service";

const QUICK_ACTIONS = [
  "¿Qué capacitaciones ofrecen?",
  "Necesito asesoramiento para mi empresa",
  "¿Cómo funciona la plataforma?",
  "Quiero coordinar una reunión",
];

export default function ChatWidget() {

  const [isOpen, setIsOpen] =
    useState(false);

  const [messages, setMessages] =
    useState<ChatMessageType[]>([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sessionId, setSessionId] =
    useState("");

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const {
    trainingRequestId,
  } = useChatContext();

  const {
    isAuthenticated,
  } = useUserContext();

  const generatedSessionId =
    useMemo(() => {

      if (
        typeof window === "undefined"
      ) return "";

      const existingSession =
        localStorage.getItem(
          "viacore_chat_session",
        );

      if (existingSession)
        return existingSession;

      const newSession =
        crypto.randomUUID();

      localStorage.setItem(
        "viacore_chat_session",
        newSession,
      );

      return newSession;

    }, []);

  useEffect(() => {

    if (!generatedSessionId)
      return;

    setSessionId(
      generatedSessionId,
    );

  }, [generatedSessionId]);

  useEffect(() => {

    const fetchHistory =
      async () => {

        const identifier =
          trainingRequestId || sessionId;

        // NO HACER REQUESTS SIN LOGIN

        if (
          !identifier ||
          !isAuthenticated
        ) {
          return;
        }

        try {

          const history =
            await getChatHistory(
              identifier,
            );

          setMessages(history);

        } catch (error: any) {

          // HISTORIAL NUEVO

          if (
            error?.statusCode === 404
          ) {

            setMessages([]);

            return;
          }

          console.error(
            "CHAT HISTORY ERROR:",
            error,
          );

          setMessages([]);

        }
      };

    fetchHistory();

  }, [
    sessionId,
    trainingRequestId,
    isAuthenticated,
  ]);

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  useEffect(() => {

    if (
      isOpen &&
      inputRef.current
    ) {

      inputRef.current.focus();

    }

  }, [isOpen]);

  const handleSendMessage =
    async (
      customMessage?: string,
    ) => {

      const finalMessage =
        customMessage || input;

      if (
        !finalMessage.trim() ||
        loading
      ) return;

      const optimisticMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        message: finalMessage,
        role: "user",
        isAiGenerated: false,
        createdAt:
          new Date().toISOString(),
      };

      setMessages((prev) => [
        ...prev,
        optimisticMessage,
      ]);

      setInput("");

      setLoading(true);

      try {

        const response =
          await sendMessage({
            message:
              finalMessage,
            sessionId,
            trainingRequestId,
          });

        setMessages((prev) => [
          ...prev,
          response,
        ]);

      } catch {

        setMessages((prev) => [
          ...prev,
          {
            id:
              crypto.randomUUID(),
            message:
              "No pudimos procesar tu consulta en este momento. Intenta nuevamente en unos instantes.",
            role:
              "assistant",
            isAiGenerated: true,
            createdAt:
              new Date().toISOString(),
          },
        ]);

      } finally {

        setLoading(false);

      }
    };

  return (
    <>
      <motion.button
        whileHover={{
          scale: 1.06,
        }}
        whileTap={{
          scale: 0.96,
        }}
        onClick={() =>
          setIsOpen(
            !isOpen,
          )
        }
        className="
          fixed
          bottom-6
          right-6
          z-999
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-[#C7962D]
          text-black
          shadow-[0_0_35px_rgba(199,150,45,0.35)]
          transition-all
          cursor-pointer
        "
      >

        {isOpen ? (
          <X size={28} />
        ) : (
          <Bot size={28} />
        )}

      </motion.button>

      <AnimatePresence>

        {isOpen && (

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              fixed
              bottom-28
              right-6
              z-998
              flex
              h-162.5
              w-95
              flex-col
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[#111315]
              shadow-2xl
              backdrop-blur-xl
              max-sm:bottom-0
              max-sm:right-0
              max-sm:h-screen
              max-sm:w-full
              max-sm:rounded-none
              cursor-pointer
            "
          >

            <ChatHeader />

            <div
              className="
                flex-1
                overflow-y-auto
                px-4
                py-5
                space-y-4
              "
            >

              {messages.length === 0 && (

                <div className="space-y-5">

                  <div>

                    <h3 className="text-xl font-semibold text-white">
                      ¿En qué podemos ayudarte hoy?
                    </h3>

                    <p className="mt-2 text-sm text-white/60">
                      Nuestro asistente puede ayudarte
                      a encontrar soluciones de capacitación,
                      coordinar reuniones y orientarte
                      dentro de la plataforma.
                    </p>

                  </div>

                  <ChatSuggestions
                    suggestions={QUICK_ACTIONS}
                    onSelect={(value) =>
                      handleSendMessage(
                        value,
                      )
                    }
                  />

                </div>

              )}

              {messages.map(
                (message) => (

                  <ChatMessage
                    key={message.id}
                    message={message}
                  />

                ),
              )}

              {loading && (
                <TypingIndicator />
              )}

              <div ref={messagesEndRef} />

            </div>

            <ChatInput
              value={input}
              loading={loading}
              onChange={setInput}
              onSend={() =>
                handleSendMessage()
              }
              inputRef={inputRef}
            />

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}
import { Bot, ShieldCheck } from "lucide-react";

import type { ChatMessage as ChatMessageType } from "@/services/chat.service";

type Props = {
  message: ChatMessageType;
};

export default function ChatMessage({
  message,
}: Props) {

  const isUser =
    message.role === "user";

  const isAdmin =
    message.role === "admin";

  const formattedTime =
    new Date(
      message.createdAt,
    ).toLocaleTimeString(
      "es-AR",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );

  return (
    <div
      className={`
        flex
        w-full
        ${isUser
          ? "justify-end"
          : "justify-start"}
      `}
    >

      <div
        className={`
          flex
          max-w-[78%]
          items-end
          gap-2
          ${isUser
            ? "flex-row-reverse"
            : "flex-row"}
        `}
      >

        {!isUser && (

          <div
            className={`
              mb-1
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              ${
                isAdmin
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-[#C7962D]/20 text-[#C7962D]"
              }
            `}
          >

            {isAdmin ? (
              <ShieldCheck size={16} />
            ) : (
              <Bot size={16} />
            )}

          </div>
        )}

        <div
          className={`
            rounded-3xl
            px-4
            py-3
            shadow-lg
            ${
              isUser
                ? `
                  bg-linear-to-r
                  from-[#C7962D]
                  to-[#E0B84F]
                  text-black
                `
                : `
                  border
                  border-white/10
                  bg-[#1A1D21]
                  text-white
                `
            }
          `}
        >

          {!isUser && (

            <div
              className={`
                mb-2
                text-xs
                font-medium
                ${
                  isAdmin
                    ? "text-blue-300"
                    : "text-[#C7962D]"
                }
              `}
            >

              {isAdmin
                ? "Equipo de soporte"
                : "Asistente Comercial"}

            </div>
          )}

          <p
            className="
              whitespace-pre-wrap
              text-sm
              leading-7
            "
          >
            {message.message}
          </p>

          <div
            className={`
              mt-3
              text-[11px]
              ${
                isUser
                  ? "text-black/60"
                  : "text-white/40"
              }
            `}
          >
            {formattedTime}
          </div>

        </div>

      </div>

    </div>
  );
}
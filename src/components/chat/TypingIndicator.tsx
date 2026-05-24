import {
  Bot,
} from "lucide-react";

export default function TypingIndicator() {

  return (
    <div className="flex justify-start">

      <div
        className="
          flex
          max-w-[78%]
          items-end
          gap-2
        "
      >

        <div
          className="
            mb-1
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#C7962D]/20
            text-[#C7962D]
          "
        >

          <Bot size={16} />

        </div>

        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-[#1A1D21]
            px-4
            py-3
            shadow-lg
          "
        >

          <div
            className="
              mb-2
              text-xs
              font-medium
              text-[#C7962D]
            "
          >
            Asistente Comercial
          </div>

          <div className="flex items-center gap-2">

            <div className="h-2 w-2 rounded-full bg-white/40 animate-bounce" />

            <div className="h-2 w-2 rounded-full bg-white/40 animate-bounce delay-100" />

            <div className="h-2 w-2 rounded-full bg-white/40 animate-bounce delay-200" />

          </div>

        </div>

      </div>

    </div>
  );
}
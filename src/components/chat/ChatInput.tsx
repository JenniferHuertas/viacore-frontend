"use client";

import {
  Send,
} from "lucide-react";

type Props = {
  value: string;
  loading: boolean;
  onChange: (
    value: string,
  ) => void;
  onSend: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function ChatInput({
  value,
  loading,
  onChange,
  onSend,
  inputRef,
}: Props) {

  return (
    <div
      className="
        border-t
        border-white/10
        p-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-[#1A1D21]
          px-4
          py-3
          transition-all
          focus-within:border-[#C7962D]/40
        "
      >

        <input
          ref={inputRef}
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value,
            )
          }
          onKeyDown={(e) => {

            if (
              e.key === "Enter"
            ) {

              e.preventDefault();

              onSend();

            }
          }}
          placeholder="Escribe tu consulta..."
          className="
            flex-1
            bg-transparent
            text-sm
            text-white
            outline-none
            placeholder:text-white/40
          "
        />

        <button
          onClick={onSend}
          disabled={
            loading ||
            !value.trim()
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-[#C7962D]
            text-black
            transition-all
            hover:brightness-110
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >

          <Send size={18} />

        </button>

      </div>

    </div>
  );
}
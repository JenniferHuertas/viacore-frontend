import {
  Sparkles,
} from "lucide-react";

export default function ChatHeader() {

  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-white/10
        px-5
        py-4
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-[#C7962D]
            text-black
          "
        >
          <Sparkles size={20} />
        </div>

        <div>

          <h2 className="font-semibold text-white">
            Asistente Comercial
          </h2>

          <div className="flex items-center gap-2">

            <div
              className="
                h-2
                w-2
                rounded-full
                bg-green-400
              "
            />

            <p className="text-sm text-white/50">
              Disponible para ayudarte
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
"use client";

type TermsModalProps = {
  onAccept: () => void;
  onClose: () => void;
};

export default function TermsModal({
  onAccept,
  onClose,
}: TermsModalProps) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">

      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0B0D0F] shadow-2xl">

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

          <div>

            <h2 className="text-2xl font-semibold text-white">
              Términos y Condiciones
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Leé atentamente antes de continuar.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-white cursor-pointer"
          >
            ×
          </button>

        </div>

        <div className="max-h-[60vh] space-y-8 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-gray-300">

          <div className="space-y-3">

            <h3 className="text-lg font-semibold text-[#C7962D]">
              Uso de la plataforma
            </h3>

            <p>
              ViaCore es una plataforma orientada a la gestión
              y coordinación de capacitaciones empresariales.
              El usuario se compromete a utilizar el sistema
              de manera responsable y proporcionando información válida.
            </p>

          </div>

          <div className="space-y-3">

            <h3 className="text-lg font-semibold text-[#C7962D]">
              Registro de usuarios
            </h3>

            <p>
              Cada usuario es responsable de mantener la confidencialidad
              de sus credenciales. ViaCore no se responsabiliza
              por accesos no autorizados ocasionados por el uso indebido
              de la cuenta.
            </p>

          </div>

          <div className="space-y-3">

            <h3 className="text-lg font-semibold text-[#C7962D]">
              Solicitudes y servicios
            </h3>

            <p>
              Las solicitudes enviadas podrán ser evaluadas,
              aprobadas, reprogramadas o canceladas según
              disponibilidad operativa y validaciones internas.
            </p>

          </div>

          <div className="space-y-3">

            <h3 className="text-lg font-semibold text-[#C7962D]">
              Privacidad y datos
            </h3>

            <p>
              La información proporcionada será utilizada
              únicamente para la gestión de servicios,
              comunicación institucional y mejora de la experiencia
              dentro de la plataforma.
            </p>

          </div>

          <div className="space-y-3">

            <h3 className="text-lg font-semibold text-[#C7962D]">
              Modificaciones
            </h3>

            <p>
              ViaCore podrá actualizar estos términos
              y condiciones en cualquier momento para mejorar
              la seguridad, estabilidad y funcionamiento
              general del sistema.
            </p>

          </div>

        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onAccept}
            className="rounded-xl bg-[#C7962D] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 cursor-pointer"
          >
            Aceptar y continuar
          </button>

        </div>

      </div>

    </div>
  );
}
"use client";

import Link from "next/link";

type ConfirmacionPagoViewProps = {
  id: string;
};

export default function ConfirmacionPagoView({
  id,
}: ConfirmacionPagoViewProps) {

  return (
    <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen flex items-center justify-center">

      <div className="max-w-xl w-full text-center">

        <div className="mb-6">
          <span className="text-5xl">
            ✔
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Pago realizado con éxito
        </h1>

        <p className="text-gray-400 mb-10">
          Tu solicitud fue confirmada.
          En breve nos pondremos
          en contacto para coordinar
          la capacitación.
        </p>

        <div className="space-y-4">

          <Link
            href="/mis-solicitudes"
            className="block w-full py-3 bg-[#C7962D] text-black rounded-md font-semibold hover:opacity-90 transition"
          >
            Ver mis solicitudes
          </Link>

          <Link
            href="/plataforma"
            className="block w-full py-3 border border-white/10 rounded-md text-white hover:bg-white/5 transition"
          >
            Explorar más capacitaciones
          </Link>

        </div>

      </div>

    </div>
  );
}
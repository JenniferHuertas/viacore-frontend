"use client";

import Link from "next/link";

export default function PaymentPendingPage() {
  return (
    <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full text-center">
        <div className="mb-6">
          <span className="text-5xl">⏳</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Pago pendiente de confirmación
        </h1>
        <p className="text-gray-400 mb-10">
          Tu pago está siendo procesado. Te notificaremos cuando se confirme.
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

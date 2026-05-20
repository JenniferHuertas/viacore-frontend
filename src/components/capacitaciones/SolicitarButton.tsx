"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

interface Props {
  trainingTitle: string;
  trainingId: string;
}

export default function SolicitarButton({ trainingTitle, trainingId }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const formUrl = `/solicitudes?categoria=${encodeURIComponent(trainingTitle)}&trainingId=${trainingId}`;

  const handleSolicitar = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      router.push(formUrl);
    }
  };

  return (
    <>
      <button
        onClick={handleSolicitar}
        className="inline-flex items-center justify-center px-8 py-4 bg-[#C7962D] text-black rounded-xl font-semibold hover:opacity-90 transition hover:scale-[1.02] cursor-pointer"
      >
        Solicitar capacitación
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-semibold text-white mb-2">
              Inicia sesión para continuar
            </h3>
            
            <p className="text-gray-400 text-sm mb-6">
              Para solicitar la capacitación en <span className="text-[#C7962D] font-medium">{trainingTitle}</span>, necesitas iniciar sesión o crear una cuenta rápida.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
              >
                Cancelar
              </button>
              
              <button
                onClick={() => router.push(`/autenticacion?returnTo=${encodeURIComponent(formUrl)}`)}
                className="px-4 py-2 rounded-md text-sm font-medium bg-[#C7962D] text-black hover:opacity-90 transition cursor-pointer"
              >
                Ingresar / Registrarme
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
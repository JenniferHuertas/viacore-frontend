"use client";

import CompleteProfileForm from "@/components/auth/CompleteProfileForm";

export default function CompletarPerfilView() {
  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[85vh] max-w-7xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0d0f] shadow-2xl">
        <aside className="hidden w-[32%] flex-col justify-between border-r border-white/10 bg-black/80 p-10 lg:flex">
          <div>
            <img src="/images/logo.png" alt="ViaCore" className="mb-12 w-24" />

            <h1 className="mb-4 text-3xl font-semibold tracking-wide">
              VIACORE
            </h1>

            <p className="mb-8 text-sm text-[#C7962D] tracking-widest">
              CONSULTING & LEARNING
            </p>

            <div className="mb-8 h-0.5 w-12 bg-[#C7962D]" />

            <p className="max-w-xs text-lg leading-relaxed text-gray-300">
              Finalizá la configuración de tu perfil para acceder a todas las
              funcionalidades de la plataforma.
            </p>
          </div>

          <div>
            <div className="mb-6 overflow-hidden rounded-xl border border-white/10 relative">
              <img
                src="https://res.cloudinary.com/dmwy7wbh7/image/upload/login-registro_u3d9kr.png"
                alt="ViaCore"
                className="h-72 w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />
            </div>

            <p className="text-sm text-gray-400">
              Completá tus datos corporativos para continuar con la experiencia
              ViaCore.
            </p>
          </div>
        </aside>

        <section className="flex w-full items-center justify-center p-8 lg:w-[68%]">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-10">
            <div className="mb-10">
              <h2 className="mb-3 text-3xl font-semibold">Completar perfil</h2>

              <div className="mb-6 h-0.5 w-12 bg-[#C7962D]" />

              <p className="text-gray-400 leading-relaxed">
                Necesitamos algunos datos adicionales para configurar
                correctamente tu cuenta empresarial.
              </p>
            </div>

            <CompleteProfileForm />
          </div>
        </section>
      </section>
    </main>
  );
}

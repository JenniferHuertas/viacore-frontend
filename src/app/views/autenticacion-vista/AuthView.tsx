"use client";

import { useState, Suspense } from "react";

import LoginForm from "@/components/auth/LoginForm";

import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthView() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <main className="min-h-screen bg-[#070707] px-2 sm:px-4 lg:px-6 py-4 sm:py-8 lg:py-10 text-white">
      <section className="mx-auto flex min-h-212.5 max-w-7xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0d0f] shadow-2xl">
        <aside className="hidden w-[32%] flex-col justify-between border-r border-white/10 bg-black/80 p-10 lg:flex">
          <div>
            <img src="/images/logo.png" alt="ViaCore" className="mb-12 w-24" />

            <h1 className="mb-4 text-3xl font-semibold tracking-wide">
              VIACORE
            </h1>

            <p className="mb-8 text-sm tracking-widest text-[#C7962D]">
              CONSULTING & LEARNING
            </p>

            <div className="mb-8 h-0.5 w-12 bg-[#C7962D]" />

            <p className="max-w-xs text-lg leading-relaxed text-gray-300">
              Impulsamos el desarrollo organizacional mediante soluciones de
              formación, capacitación y acompañamiento estratégico para
              empresas.
            </p>
          </div>

          <div>
            <div className="relative mb-6 overflow-hidden rounded-xl border border-white/10">
              <img
                src="https://res.cloudinary.com/dmwy7wbh7/image/upload/login-registro_u3d9kr.png"
                alt="ViaCore"
                className="h-72 w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />
            </div>

            <p className="text-sm text-gray-400">
              Transformamos el aprendizaje en resultados reales para las
              organizaciones.
            </p>
          </div>
        </aside>

        <section className="flex w-full items-center justify-center p-3 sm:p-6 lg:w-[68%] lg:p-8">
          <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="grid grid-cols-2 border-b border-white/10">
              <button
                onClick={() => setIsLogin(true)}
                className={`py-6 text-center font-semibold transition cursor-pointer ${
                  isLogin
                    ? "border-b-2 border-[#C7962D] text-[#C7962D]"
                    : "text-gray-400"
                }`}
              >
                Acceder
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`py-6 text-center font-semibold transition cursor-pointer ${
                  !isLogin
                    ? "border-b-2 border-[#C7962D] text-[#C7962D]"
                    : "text-gray-400"
                }`}
              >
                Crear cuenta empresarial
              </button>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <div className="w-full lg:border-r lg:border-white/10 lg:pr-10">
                <h2 className="mb-2 text-lg font-semibold">
                  {isLogin ? "Accedé a tu espacio" : "Creá tu cuenta"}
                </h2>

                <div className="mb-8 mt-4 h-0.5 w-10 bg-[#C7962D]" />

                <Suspense
                  fallback={
                    <div className="animate-pulse text-sm text-[#C7962D]">
                      Cargando formulario...
                    </div>
                  }
                >
                  {isLogin ? (
                    <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                  ) : (
                    <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                  )}
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

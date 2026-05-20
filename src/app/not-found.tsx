import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#070707] px-4 py-20 relative overflow-hidden">
      
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-125 h-75 bg-[#C7962D]/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-2xl text-center border border-white/10 rounded-2xl p-10 sm:p-14 bg-white/5 backdrop-blur">

        <h1 className="text-6xl sm:text-7xl font-bold text-white mb-6">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
          Página no encontrada
        </h2>

        <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-md mx-auto">
          La página que estás buscando no existe o fue movida.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 rounded-xl font-medium text-lg text-black bg-linear-to-r from-[#C7962D] to-[#E0B84F] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_30px_rgba(199,150,45,0.25)] active:scale-[0.98]"
        >
          Ir al home
        </Link>
      </div>
    </section>
  );
}
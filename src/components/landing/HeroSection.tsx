import Button from "@/components/ui/Button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[#070707] text-white px-6 py-20">
      <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-2 md:items-start">
        <div className="max-w-lg">
          <p className="text-xs text-white/50 uppercase tracking-wide mb-3">
            Plataforma de formación para empresas
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-7">
            Gestioná la capacitación
            <br />
            de tu equipo
            <br />
            en una <span className="text-[#C7962D]">sola plataforma</span>
          </h1>

          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Explorá capacitaciones, coordiná procesos y seguí todo desde un solo
            lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/plataforma">
              <Button className="w-full sm:w-auto">
                Explorar capacitaciones
              </Button>
            </Link>

            <Link
              href="/casos"
              className="px-5 py-3 rounded-md font-normal border border-white/20 text-sm hover:border-[#C7962D] transition text-center"
            >
              Ver casos reales
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <img
              src="https://res.cloudinary.com/dmwy7wbh7/image/upload/hero_wbacwc.png"
              alt="Capacitación empresarial"
              className="w-full h-105 object-cover transition duration-500 hover:scale-105"
            />
          </div>

          <div className="absolute inset-0 rounded-2xl bg-black/30 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

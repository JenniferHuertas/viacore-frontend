import { getTrainingById } from "@/services/training.service";
import SolicitarButton from "@/components/capacitaciones/SolicitarButton";

interface Props {
  id: string;
}

export default async function CapacitacionDetailView({ id }: Props) {
  const training = await getTrainingById(id);

  if (!training) {
    return (
      <div className="text-white p-10">No encontramos esta capacitación</div>
    );
  }

  return (
    <div className="bg-[#070707] text-white px-6 pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-5xl">
        <img
          src={training.fileResource.fileUrl}
          alt={training.title}
          className="w-full h-87.5 md:h-105 object-cover rounded-2xl mb-10 border border-white/10"
        />

        <h1 className="text-4xl md:text-6xl font-semibold mb-4 leading-tight">
          {training.title}
        </h1>

        <p className="text-[#C7962D] text-lg md:text-xl mb-8">
          {training.tagline}
        </p>

        <p className="text-gray-400 text-lg leading-relaxed mb-12">
          {training.description}
        </p>

        <div className="mb-12 p-8 border border-[#C7962D]/20 rounded-2xl bg-linear-to-br from-[#C7962D]/10 to-transparent backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-6">
            ¿Qué incluye esta capacitación?
          </h2>

          <ul className="space-y-4 text-gray-300">
            {training.includes.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[#C7962D] text-lg">✔</span>

                <span className="text-base md:text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <SolicitarButton
          trainingTitle={training.title}
          trainingId={training.id}
        />
      </div>
    </div>
  );
}

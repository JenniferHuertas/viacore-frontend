"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { getAllTrainings } from "@/services/training.service";

type Training = {
  id: string;

  title: string;

  shortDescription: string;

  fileResource?: {
    fileUrl: string;
  };
};

export default function PlataformaView() {

  const [trainings, setTrainings] =
    useState<Training[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchTrainings =
    async () => {

      try {

        const data =
          await getAllTrainings();

        setTrainings(data);

      } catch (error) {

        console.error(
          "Error loading trainings",
          error,
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchTrainings();

    const interval =
      setInterval(
        fetchTrainings,
        5000,
      );

    return () =>
      clearInterval(interval);

  }, []);

  return (
    <div className="bg-[#070707] text-white px-6 py-24">

      <div className="mx-auto max-w-7xl">

        <div className="max-w-xl mb-16">

          <h1 className="text-4xl md:text-5xl font-semibold mb-6">
            Gestioná todas tus capacitaciones en un solo lugar
          </h1>

          <p className="text-gray-400">
            Explorá las distintas áreas de capacitación y elegí la que mejor
            se adapte a tu equipo.
          </p>

        </div>

        {loading ? (

          <div className="text-gray-400">
            Cargando capacitaciones...
          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">

            {trainings.map(
              (training) => (

                <Link
                  key={training.id}
                  href={`/capacitaciones/${training.id}`}
                >

                  <div className="cursor-pointer border border-white/10 rounded-xl bg-white/5 transition hover:border-[#C7962D] hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(199,150,45,0.15)] h-full flex flex-col overflow-hidden">

                    <img
                      src={
                        training
                          .fileResource
                          ?.fileUrl ||
                        "/images/placeholder.png"
                      }
                      alt={training.title}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-6 flex flex-col flex-1">

                      <h3 className="text-lg font-semibold mb-2">
                        {training.title}
                      </h3>

                      <p className="text-gray-400 text-sm flex-1">
                        {training.shortDescription}
                      </p>

                    </div>

                  </div>

                </Link>
              ),
            )}

          </div>

        )}

      </div>

    </div>
  );
}
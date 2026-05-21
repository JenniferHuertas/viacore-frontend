"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getTrainingRequestById,
} from "@/services/trainingRequests.service";

type PagoViewProps = {
  id: string;
};

export default function PagoView({
  id,
}: PagoViewProps) {

  const [solicitud, setSolicitud] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const data =
            await getTrainingRequestById(
              id,
            );

          setSolicitud(data);

        } catch (err) {

          console.error(
            "ERROR:",
            err,
          );

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, [id]);

  if (loading) {

    return (
      <p className="text-white p-10">
        Cargando...
      </p>
    );
  }

  if (!solicitud) {

    return (
      <p className="text-white p-10">
        Solicitud no encontrada
      </p>
    );
  }

  const handlePago =
    async () => {

      try {

        setLoading(true);

        const res =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/create-preference`,
            {
              method: "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  trainingRequestId:
                    solicitud.id,

                  userId:
                    solicitud.user.id,
                },
              ),
            },
          );

        const data =
          await res.json();

        if (data.init_point) {

          window.location.href =
            data.init_point;
        }

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="bg-[#070707] text-white px-6 pt-32 pb-24 min-h-screen">

      <div className="mx-auto max-w-3xl">

        <h1 className="text-3xl font-semibold mb-6">
          Confirmar servicio
        </h1>

        <div className="border border-white/10 p-6 rounded-xl bg-white/5 space-y-4">

          <p>
            Servicio:
            {" "}
            {
              solicitud.training
                .title
            }
          </p>

          <p>
            Participantes:
            {" "}
            {
              solicitud.participantsCount
            }
          </p>

        </div>

        <div className="mt-6 border border-white/10 p-6 rounded-xl bg-white/5 flex justify-between">

          <p>Total</p>

          <p className="text-[#C7962D] text-2xl font-semibold">

            $
            {Number(
              solicitud.estimatedPrice,
            ).toLocaleString()}
            {" "}
            ARS

          </p>

        </div>

        <button
          onClick={
            handlePago
          }
          disabled={loading}
          className="w-full mt-10 py-4 bg-[#C7962D] text-black rounded-md font-semibold cursor-pointer"
        >
          {loading
            ? "Redirigiendo..."
            : "Pagar con Mercado Pago"}
        </button>

      </div>

    </div>
  );
}
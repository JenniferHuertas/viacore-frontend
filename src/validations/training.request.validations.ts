import { z } from "zod";

export const trainingRequestSchema =
  z.object({

    personas: z
      .string()
      .min(
        1,
        "Debes ingresar la cantidad de personas",
      )
      .refine(
        (value) =>
          Number(value) >= 1,
        {
          message:
            "Debe haber al menos 1 participante",
        },
      )
      .refine(
        (value) =>
          Number(value) <= 10000,
        {
          message:
            "La cantidad de participantes es demasiado alta",
        },
      ),

    objetivo: z
      .string()
      .trim()
      .min(
        20,
        "Los objetivos deben tener al menos 20 caracteres",
      )
      .max(
        2000,
        "Los objetivos no pueden superar los 2000 caracteres",
      ),

    contexto: z
      .string()
      .trim()
      .min(
        30,
        "El contexto debe tener al menos 30 caracteres",
      )
      .max(
        3000,
        "El contexto no puede superar los 3000 caracteres",
      ),
  });
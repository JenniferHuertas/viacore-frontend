import { z } from "zod";

export const trainingRequestSchema = z.object({
  categoria: z.string().min(1),
  personas: z
    .string()
    .refine((v) => Number(v) >= 1, "Debe haber al menos una persona"),
  objetivo: z.string().min(20, "Por favor, detalla más los objetivos (mínimo 20 caracteres)"),
  contexto: z.string().min(30, "El contexto es muy corto, brinda más detalles (mínimo 30 caracteres)"),
});
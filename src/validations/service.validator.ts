import { z } from "zod";

export const serviceSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede superar los 100 caracteres")
    .optional(),

  shortDescription: z
    .string()
    .min(10, "La descripción corta debe tener al menos 10 caracteres")
    .max(120, "La descripción corta no puede superar los 120 caracteres")
    .optional(),

  description: z
    .string()
    .min(30, "La descripción debe tener al menos 30 caracteres")
    .max(3000, "La descripción es demasiado larga")
    .optional(),

  tagline: z
    .string()
    .min(5, "La tagline debe tener al menos 5 caracteres")
    .max(120, "La tagline no puede superar los 120 caracteres")
    .optional(),

  category: z
    .string()
    .min(3, "La categoría debe tener al menos 3 caracteres")
    .max(50, "La categoría no puede superar los 50 caracteres")
    .optional(),

  includes: z
    .array(z.string().min(2, "Los includes deben tener al menos 2 caracteres"))
    .optional(),

  file: z
    .union([z.instanceof(File), z.null()])
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
          file.type,
        );
      },
      { message: "Formato de imagen inválido" },
    )
    .refine(
      (file) => {
        if (!file) return true;

        return file.size <= 5 * 1024 * 1024;
      },
      {
        message: "La imagen no puede superar los 5MB",
      },
    ),
});

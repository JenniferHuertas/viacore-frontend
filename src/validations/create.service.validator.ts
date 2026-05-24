import { z } from "zod";

export const createServiceSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede superar los 100 caracteres"),

  shortDescription: z
    .string()
    .min(10, "La descripción corta debe tener al menos 10 caracteres")
    .max(160, "La descripción corta no puede superar los 160 caracteres"),

  description: z
    .string()
    .min(30, "La descripción debe tener al menos 30 caracteres")
    .max(3000, "La descripción no puede superar los 3000 caracteres"),

  tagline: z
    .string()
    .min(10, "La tagline debe tener al menos 10 caracteres")
    .max(150, "La tagline no puede superar los 150 caracteres"),

  category: z
    .string()
    .min(3, "La categoría debe tener al menos 3 caracteres")
    .max(50, "La categoría no puede superar los 50 caracteres"),

  includes: z.array(z.string()).min(1, "Debes agregar al menos un include"),

  file: z
    .instanceof(File, {
      message: "Debes seleccionar una imagen",
    })
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
          file.type,
        ),
      {
        message: "Formato de imagen inválido",
      },
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "La imagen no puede superar los 5MB",
    }),
});

import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(
      2,
      "El nombre debe tener 2 caracteres como mínimo",
    )
    .max(
      50,
      "El nombre no puede tener más de 50 caracteres",
    ),

  phone: z
    .string()
    .min(
      1,
      "El teléfono es obligatorio",
    )
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      "El teléfono debe ser un número internacional válido",
    ),

  country: z
    .string()
    .min(
      1,
      "El país es obligatorio",
    ),

  address: z
    .string()
    .min(
      1,
      "La dirección es obligatoria",
    )
    .min(
      2,
      "La dirección debe tener al menos 2 caracteres",
    )
    .max(
      50,
      "La dirección no puede tener más de 50 caracteres",
    ),

  city: z
    .string()
    .min(
      1,
      "La ciudad es obligatoria",
    )
    .min(
      2,
      "La ciudad debe tener al menos 2 caracteres",
    )
    .max(
      50,
      "La ciudad no puede tener más de 50 caracteres",
    ),

  companyName: z
    .string()
    .min(
      1,
      "La empresa es obligatoria",
    )
    .min(
      2,
      "La empresa debe tener al menos 2 caracteres",
    )
    .max(
      50,
      "La empresa no puede tener más de 50 caracteres",
    ),
});
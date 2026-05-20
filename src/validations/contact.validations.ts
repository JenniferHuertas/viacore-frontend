import { z } from "zod";
    
export const contactSchema = z
 .object({
    nombre: z
      .string()
      .min(1, "El nombre es obligatorio")
      .min(2, "El nombre debe tener 2 caracteres como mínimo")
      .max(50, "El nombre no puede tener más de 50 caracteres"),

    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Email inválido"),

    empresa: z
      .string()
      .min(1, "La empresa es obligatoria")
      .min(2, "La empresa debe tener al menos 2 caracteres")
      .max(50, "La empresa no puede tener más de 50 caracteres"),

    mensaje: z
      .string()
      .min(20, "El mensaje debe tener al menos 20 caracteres")
      .max(500, "El mensaje debe tener 500 caracteres como máximo"),  
  })

  
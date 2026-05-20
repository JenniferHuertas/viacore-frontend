import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .min(2, "El nombre debe tener 2 caracteres como mínimo")
      .max(50, "El nombre no puede tener más de 50 caracteres"),

    email: z
      .string()
      .min(1, "El email es obligatorio")
      .pipe(z.email("Email inválido")),

    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /[A-Z]/,
        "La contraseña debe contener al menos una mayúscula"
      )
      .regex(
        /[a-z]/,
        "La contraseña debe contener al menos una minúscula"
      )
      .regex(
        /[0-9]/,
        "La contraseña debe contener al menos un número"
      )
      .regex(
        /^(?=.*[.,!@#$%^&*()_\-+=\[\]{};:'"\\|<>/?`~]).+$/,
        "La contraseña debe contener al menos un carácter especial"
      ),

    confirmPassword: z
      .string()
      .min(1, "Debes confirmar la contraseña"),

    phone: z
      .string()
      .min(1, "El teléfono es obligatorio")
      .regex(
      /^\+?[1-9]\d{7,14}$/,
       "El teléfono debe ser un número internacional válido"
       ),
       
    country: z
      .string()
      .min(1, "El país es obligatorio"),

      address: z
      .string()
      .min(1, "La dirección es obligatoria")
      .min(2, "La dirección debe tener al menos 2 caracteres")
      .max(50, "La dirección no puede tener más de 50 caracteres"),

    city: z
      .string()
      .min(1, "La ciudad es obligatoria")
      .min(2, "La ciudad debe tener al menos 2 caracteres")
      .max(50, "La ciudad no puede tener más de 50 caracteres"),

    companyName: z
      .string()
      .min(1, "La empresa es obligatoria")
      .min(2, "La empresa debe tener al menos 2 caracteres")
      .max(50, "La empresa no puede tener más de 50 caracteres"),

     acceptedTerms: z.boolean(),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

  .refine((data) => data.acceptedTerms === true, {
    message: "Debes aceptar los términos y condiciones",
    path: ["acceptedTerms"],
  });
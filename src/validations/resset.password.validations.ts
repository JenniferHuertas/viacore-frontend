    import { z } from "zod";
    
    export const resetPasswordSchema = z
      .object({
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
    })

        .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

  
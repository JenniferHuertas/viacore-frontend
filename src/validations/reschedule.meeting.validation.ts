import { z } from "zod";

export const rescheduleSchema = z.object({
  date: z
    .string()
    .min(1, "La fecha es obligatoria")
    .refine((value) => {
      const day = new Date(value).getDay();

      return day !== 0 && day !== 6;
    }, {
      message: "Solo se permiten días hábiles",
    }),

  time: z
    .string()
    .min(1, "La hora es obligatoria")
    .refine((value) => {
      return value >= "09:00" && value <= "17:00";
    }, {
      message: "Solo horarios de 09:00 a 17:00",
    }),
});
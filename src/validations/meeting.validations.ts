import { z } from "zod";

const esDiaHabil = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  const weekDay = date.getDay();

  return weekDay >= 1 && weekDay <= 5;
};

const esHorarioLaboral = (time: string) => {
  const [h, m] = time.split(":").map(Number);

  const minutos = h * 60 + m;

  return minutos >= 9 * 60 && minutos <= 16 * 60 + 30;
};

export const meetingSchema = z.object({
  fecha: z
    .string()
    .refine(esDiaHabil, "Solo días hábiles (Lun–Vie)"),

  horario: z
    .string()
    .refine(esHorarioLaboral, "Horario permitido: 09:00 - 16:30"),
});


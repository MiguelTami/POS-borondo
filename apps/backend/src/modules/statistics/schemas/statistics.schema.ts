import { z } from "zod";

export const getStatisticsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.string().optional(),
});

export const getShiftOrdersSchema = z.object({
  shiftId: z.string().refine((val) => !isNaN(Number(val)), {
    message: "shiftId debe ser un número válido",
  }),
});

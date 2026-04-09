import { z } from "zod";

export const moveInventoryQuerySchema = z.object({
  type: z.enum(["SALE_DEDUCTION", "RESTOCK", "WASTE", "MANUAL_ADJUSTMENT"]).optional(),
  ingredientId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(20),
});

export const createAdjustmentSchema = z.object({
  ingredientId: z.number().int().positive(),
  type: z.enum(["RESTOCK", "WASTE", "MANUAL_ADJUSTMENT"]),
  quantity: z.number().refine(val => val !== 0, { message: "Quantity cannot be zero" }),
}).strict();

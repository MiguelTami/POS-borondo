import { z } from "zod";

export const createOrderItemModifierSchema = z.object({
    quantity: z.number().int().positive(),
    type: z.enum(["EXTRA", "REMOVE"]),
    ingredientId: z.number().int().positive(),
}).strict()

export const updateOrderItemModifierSchema = z.object({
    quantity: z.number().int().positive().optional(),
    type: z.enum(["EXTRA", "REMOVE"]).optional(),
    ingredientId: z.number().int().positive().optional(),
}).strict()
import { z } from "zod";

export const createOrderItemModifierSchema = z.object({
    quantity: z.number().int().positive(),
    type: z.enum(["EXTRA", "REMOVE"]),
    ingredientId: z.number().int().positive(),
});
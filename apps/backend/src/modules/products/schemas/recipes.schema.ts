import { z } from "zod"

export const createRecipeSchema = z.object({
  ingredientId: z.number().int(),

  quantityRequired: z.number().positive("Quantity must be greater than 0")
})

export const updateRecipeSchema = z.object({
  ingredientId: z.number().int().optional(),

  quantityRequired: z.number().positive().optional()
})
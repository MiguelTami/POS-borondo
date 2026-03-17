import { z } from "zod"

export const productIdParamSchema = z.object({
  productId: z.coerce.number().int().positive()
})

export const ingredientIdParamSchema = z.object({
  ingredientId: z.coerce.number().int().positive()
})

export const categoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive()
})

export const recipeIdParamSchema = z.object({
  recipeId: z.coerce.number().int().positive()
})
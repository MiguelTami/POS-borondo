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

export const tableIdParamSchema = z.object({
  tableId: z.coerce.number().int().positive()
})

export const orderIdParamSchema = z.object({
  orderId: z.coerce.number().int().positive()
})

export const subOrderIdParamSchema = z.object({
  subOrderId: z.coerce.number().int().positive()
})

export const itemIdParamSchema = z.object({
  itemId: z.coerce.number().int().positive()
})

export const modifierIdParamSchema = z.object({
  modifierId: z.coerce.number().int().positive()
})

export const paymentIdParamSchema = z.object({
  paymentId: z.coerce.number().int().positive()
})

export const userIdParamSchema = z.object({
  userId: z.coerce.number().int().positive()
})
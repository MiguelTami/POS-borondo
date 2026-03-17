import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),

  price: z.number().positive("Price must be greater than 0"),

  categoryId: z.number().int(),

  isActive: z.boolean().optional()
})

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),

  price: z.number().positive().optional(),

  categoryId: z.number().int().optional(),

  isActive: z.boolean().optional()
})
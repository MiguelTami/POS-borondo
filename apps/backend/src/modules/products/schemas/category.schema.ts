import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),

  isActive: z.boolean().optional()
})

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),

  isActive: z.boolean().optional()
})
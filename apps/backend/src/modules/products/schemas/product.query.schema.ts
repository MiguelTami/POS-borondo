import { z } from "zod"

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().optional(),

  categoryId: z.coerce.number().int().optional(),

  isActive: z.coerce.boolean().optional()
})
import { z } from "zod"

const booleanFromQuery = z.preprocess((val) => {
  if (Array.isArray(val)) val = val[0];
  if (val === "true") return true;
  if (val === "false") return false;
  return val;
}, z.boolean());

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  categoryId: z.coerce.number().int().optional(),
  
  isActive: booleanFromQuery.optional()
})
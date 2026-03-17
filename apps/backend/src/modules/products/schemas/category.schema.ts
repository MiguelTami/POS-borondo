import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
}).strict()

export const updateCategorySchema = z.object({
  name: z.string().min(1),
}).strict()
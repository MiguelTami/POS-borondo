import { z } from "zod"

export const createOrderSchema = z.object({
  tableId: z.number().int().positive("Table ID must be a positive integer"),
}).strict()

export const updateOrderSchema = z.object({
  tableId: z.number().int().positive("Table ID must be a positive integer").optional(),
}).strict()
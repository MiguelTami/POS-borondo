import { z } from "zod"

export const createOrderSchema = z.object({
  tableId: z.number().int().positive("Table ID must be a positive integer"),
  waiterId: z.number().int().positive("Waiter ID must be a positive integer"),
}).strict()

export const updateOrderSchema = z.object({
  tableId: z.number().int().positive("Table ID must be a positive integer").optional(),
  waiterId: z.number().int().positive("Waiter ID must be a positive integer").optional(),
}).strict()

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
}).strict()
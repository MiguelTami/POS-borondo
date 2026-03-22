import { z } from "zod"

export const createOrderSchema = z.object({
  tableId: z.number().int().positive("Table ID must be a positive integer"),
  waiterId: z.number().int().positive("Waiter ID must be a positive integer"),
}).strict()
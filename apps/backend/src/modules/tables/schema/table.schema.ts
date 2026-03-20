import { z } from "zod"

export const createTableSchema = z.object({
  number: z.number().int().positive("Table number must be a positive integer"),
}).strict()

export const updateTableSchema = z.object({
  number: z.number().int().positive("Table number must be a positive integer").optional(),

  status: z.enum(["AVAILABLE", "OCCUPIED", "RESERVED", "OUT_OF_SERVICE"]).optional(),
}).strict()
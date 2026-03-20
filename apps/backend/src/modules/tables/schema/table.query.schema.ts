import { number } from "joi";
import { z } from "zod"

const TableStatusEnum = z.enum(["AVAILABLE", "OCCUPIED", "RESERVED", "OUT_OF_SERVICE"]);

export const getTablesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  number: z.coerce.number().int().positive().optional(),

  status: TableStatusEnum.optional(),

  hasOpenOrder: z.enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),

  sortBy: z.enum(["number", "status", "createdAt"]).optional().default("number"),
  
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
})
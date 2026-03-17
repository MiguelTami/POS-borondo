import { z } from "zod"

export const createIngredientSchema = z.object({
  name: z.string().min(1, "Name is required"),

  unit: z.enum([
    "UNIT",
    "GRAM",
    "KILOGRAM",
    "MILLILITER",
    "LITER"
  ]),

  stock: z.number().min(0, "Stock cannot be negative"),

  minStockAlert: z.number().int().min(0),
}).strict()

export const updateIngredientSchema = z.object({
  name: z.string().min(1).optional(),

  unit: z.enum([
    "UNIT",
    "GRAM",
    "KILOGRAM",
    "MILLILITER",
    "LITER"
  ]).optional(),

  minStockAlert: z.number().int().min(0).optional(),
}).strict()
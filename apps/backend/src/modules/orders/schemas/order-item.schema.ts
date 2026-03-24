import { z } from "zod"

export const createOrderItemSchema = z.object({
    productId: z.number().int().positive("Product ID must be a positive integer"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    notes: z.string().optional()
}).strict()
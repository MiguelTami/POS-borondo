import { z } from "zod";

export const createSubOrderSchema = z.object({
    label: z.string().min(1)
});

export const updateSubOrderSchema = z.object({
    label: z.string().min(1)
});
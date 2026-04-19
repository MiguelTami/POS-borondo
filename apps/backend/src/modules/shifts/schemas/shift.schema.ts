import { z } from 'zod';

export const OpenShiftSchema = z.object({
    pettyCash: z.number().min(0, 'La caja menor no puede ser negativa').default(0)
}).strict();

export const CloseShiftSchema = z.object({
    declaredCash: z.number().min(0, 'El efectivo declarado no puede ser negativo')
}).strict();

export const GetShiftsQuerySchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    openedById: z.union([z.number(), z.string().transform(val => Number(val))]).optional(),
    closedById: z.union([z.number(), z.string().transform(val => Number(val))]).optional()
}).strict();

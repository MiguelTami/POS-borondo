import { z } from 'zod';

export const CreatePaymentSchema = z.object({
    subOrderId: z.number().int().positive(),
    shiftId: z.number().int().positive(),
    method: z.enum(['CASH', 'CARD', 'MOBILE_PAYMENT']),
    printReceipt: z.boolean().optional().default(false),
}).strict();

export const UpdatePaymentSchema = z.object({
    method: z.enum(['CASH', 'CARD', 'MOBILE_PAYMENT'])
}).strict();

export const GetPaymentsQuerySchema = z.object({
    shiftId: z.coerce.number().int().positive().optional(),
    method: z.enum(['CASH', 'CARD', 'MOBILE_PAYMENT']).optional(),
    cashierId: z.coerce.number().int().positive().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    orderId: z.coerce.number().int().positive().optional(),
}).strict();
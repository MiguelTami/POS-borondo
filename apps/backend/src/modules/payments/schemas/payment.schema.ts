import { z } from 'zod';

export const CreatePaymentSchema = z.object({
    subOrderId: z.number().int().positive(),
    shiftId: z.number().int().positive(),
    method: z.enum(['CASH', 'CARD', 'MOBILE_PAYMENT']),
}).strict();
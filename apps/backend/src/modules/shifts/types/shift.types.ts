import { z } from 'zod';
import { CloseShiftSchema, GetShiftsQuerySchema } from '../schemas/shift.schema';
import { Decimal } from '@prisma/client/runtime/library';

export type CloseShiftDTO = z.infer<typeof CloseShiftSchema>;
export type GetShiftsQueryDTO = z.infer<typeof GetShiftsQuerySchema>;

export interface GenerateShiftSummaryReturn {
    expectedRevenue: number;
}

import { z } from 'zod';
import { CloseShiftSchema, GetShiftsQuerySchema, OpenShiftSchema } from '../schemas/shift.schema';
import { Decimal } from '@prisma/client/runtime/library';

export type OpenShiftDTO = z.infer<typeof OpenShiftSchema>;
export type CloseShiftDTO = z.infer<typeof CloseShiftSchema>;
export type GetShiftsQueryDTO = z.infer<typeof GetShiftsQuerySchema>;

export interface GenerateShiftSummaryReturn {
    expectedRevenue: number;
}

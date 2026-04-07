import { PaymentMethod } from "@prisma/client";

export interface CreatePaymentDTO {
    method: PaymentMethod;
    amount: number;
}

export interface GetPaymentsFilters {
    shiftId?: number;
    method?: PaymentMethod;
    cashierId?: number;
    startDate?: Date;
    endDate?: Date;
    orderId?: number;
}
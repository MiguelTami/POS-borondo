import { PaymentMethod } from "@prisma/client";

export interface CreatePaymentDTO {
    method: PaymentMethod;
    amount: number;
}
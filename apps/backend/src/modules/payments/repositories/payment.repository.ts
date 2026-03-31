import { prisma } from "../../../config/prisma";
import { PaymentMethod } from "@prisma/client";
import { CreatePaymentDTO } from "../types/payment.types";

export class PaymentRepository {

    async createPayment(subOrderId: number, shiftId: number, data: CreatePaymentDTO) {
        return await prisma.payment.create({
            data: {
                subOrderId,
                shiftId,
                cashierId: 3,
                ...data
            },
        });
    }
}
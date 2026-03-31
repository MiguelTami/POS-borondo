import { PaymentRepository } from "../repositories/payment.repository";
import { CreatePaymentDTO } from "../types/payment.types";
import { PaymentMethod } from "@prisma/client";
import { SubOrderService } from "../../orders/services/sub-order.service";

export class PaymentService {

    private paymentRepository: PaymentRepository;
    private subOrderService: SubOrderService;

    constructor() {
        this.paymentRepository = new PaymentRepository();
        this.subOrderService = new SubOrderService();
    }

    async createPayment(subOrderId: number, shiftId: number, method: string) {
        const subOrder = await this.subOrderService.getSubOrderByIdOnly(subOrderId);
        const orderItems = subOrder.orderItems;

        if (subOrder.status === "CANCELLED" || subOrder.status === "PAID") {
            throw new Error("No se pueden agregar pagos a una sub-orden que está cancelada o pagada");
        }
        if (subOrder.status !== "SENT_TO_CASHIER") {
            throw new Error("No se pueden agregar pagos a una sub-orden que no ha sido enviada al cajero");
        }

        const calculatedTotal = orderItems.reduce((total, item) => {
            return total + Number(item.totalPriceSnapshot);
        }, 0);

        const data: CreatePaymentDTO = {
            amount: calculatedTotal,
            method: method as PaymentMethod
        };
        
        return await this.paymentRepository.createPayment(subOrderId, shiftId, data);
    }
}
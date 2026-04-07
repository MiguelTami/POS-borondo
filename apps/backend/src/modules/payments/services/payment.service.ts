import { PaymentRepository } from "../repositories/payment.repository";
import { CreatePaymentDTO, GetPaymentsFilters } from "../types/payment.types";
import { PaymentMethod } from "@prisma/client";
import { SubOrderService } from "../../orders/services/sub-order.service";

export class PaymentService {

    private repository: PaymentRepository;
    private subOrderService: SubOrderService;

    constructor() {
        this.repository = new PaymentRepository();
        this.subOrderService = new SubOrderService();
    }

    async getPayments(filters: GetPaymentsFilters) {
        if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
            throw new Error("La fecha de inicio no puede ser mayor que la fecha de fin");
        }
        return await this.repository.getPayments(filters);
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
        
        return await this.repository.createPayment(subOrderId, shiftId, data);
    }

    async getPaymentById(paymentId: number) {
        const payment = await this.repository.getPaymentById(paymentId);
        if (!payment) {
            throw new Error("Pago no encontrado");
        }
        return payment;
    }

    async getPaymentBySubOrder(subOrderId: number) {
        await this.subOrderService.getSubOrderByIdOnly(subOrderId);
        const payment = await this.repository.getPaymentBySubOrder(subOrderId);
        if (!payment) {
            throw new Error("Pago no encontrado");
        }
        return payment;
    }

    async updatePayment(paymentId: number, method: PaymentMethod) {
        await this.getPaymentById(paymentId);
        
        return await this.repository.updatePayment(paymentId, method);

    }

    async deletePayment(paymentId: number) {
        const payment = await this.getPaymentById(paymentId);
        if (payment.subOrder.order.status === "PAID" || payment.subOrder.order.status === "CANCELLED") {
            throw new Error("No se pueden eliminar pagos de una orden que ya ha sido pagada o cancelada");
        }

        return await this.repository.deletePayment(paymentId, payment.subOrderId);
    }     
}
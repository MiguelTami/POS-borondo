import { PaymentRepository } from "../repositories/payment.repository";
import { CreatePaymentDTO, GetPaymentsFilters } from "../types/payment.types";
import { PaymentMethod } from "@prisma/client";
import { SubOrderService } from "../../orders/services/sub-order.service";
import { ShiftService } from "../../shifts/services/shift.service";
import { PrinterService } from "../../orders/services/printer.service";

export class PaymentService {

    private repository: PaymentRepository;
    private subOrderService: SubOrderService;
    private shiftService: ShiftService;

    constructor() {
        this.repository = new PaymentRepository();
        this.subOrderService = new SubOrderService();
        this.shiftService = new ShiftService();
    }

    async getPayments(filters: GetPaymentsFilters) {
        if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
            throw new Error("La fecha de inicio no puede ser mayor que la fecha de fin");
        }
        return await this.repository.getPayments(filters);
    }

    async createPayment(subOrderId: number, shiftId: number, method: string, cashierId: number, printReceipt: boolean = false) {
        const activeShift = await this.shiftService.getActiveShift();
        const activeShiftId = activeShift.id;
        
        if (shiftId !== activeShiftId) {
            throw new Error("Solo se pueden agregar pagos al turno activo");
        }
        const subOrder = await this.subOrderService.getSubOrderByIdOnly(subOrderId);
        const orderItems = subOrder.orderItems;

        if (subOrder.status === "CANCELLED" || subOrder.status === "PAID") {
            throw new Error("No se pueden agregar pagos a una sub-orden que está cancelada o pagada");
        }
        if (subOrder.status !== "SENT_TO_KITCHEN") {
            throw new Error("No se pueden agregar pagos a una sub-orden que no ha sido enviada a cocina");
        }

        const calculatedTotal = orderItems.reduce((total, item) => {
            return total + Number(item.totalPriceSnapshot);
        }, 0);

        const data: CreatePaymentDTO = {
            amount: calculatedTotal,
            method: method as PaymentMethod,
            cashierId: cashierId
        };
        
        const result = await this.repository.createPayment(subOrderId, shiftId, data);

        if (printReceipt) {
            const receiptInfo = {
                label: subOrder.label,
                items: orderItems.map((item: any) => ({
                    quantity: item.quantity,
                    productName: item.product?.name || "Producto",
                    totalPrice: item.totalPriceSnapshot
                })),
                total: calculatedTotal
            };
            PrinterService.printReceipt(receiptInfo);
        }

        return result;
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
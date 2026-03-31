import { SubOrderRepository } from "../repositories/sub-order.repository";
import { SubOrderResponse } from "../types/sub-order.types";
import { OrderService } from "./order.service";

export class SubOrderService {

    private repository: SubOrderRepository;
    private orderService: OrderService;

    constructor() {
        this.repository = new SubOrderRepository();
        this.orderService = new OrderService();
    }

    async createSubOrder(orderId: number, label: string): Promise<SubOrderResponse> {
        const order = await this.orderService.getOrderById(orderId);
        if (order.status === "CANCELLED" || order.status === "PAID") {
            throw new Error("No se pueden agregar sub-órdenes a una orden que está cancelada o pagada");
        }
        return this.repository.createSubOrder(orderId, label);
    }

    async getSubOrders(orderId: number) {
        await this.orderService.getOrderById(orderId);
        const subOrders = await this.repository.getSubOrders(orderId);
        if (subOrders.length === 0) {
            throw new Error("No se encontraron sub-órdenes para esta orden");
        }
        return subOrders;
    }

    async getSubOrderById(orderId: number, subOrderId: number) {
        const subOrder = await this.repository.getSubOrderById(subOrderId);

        if (!subOrder) {
            throw new Error("SubOrden no encontrada");
        }
        if (subOrder.order.id !== orderId) {
            throw new Error("SubOrden no pertenece a la orden");
        }
        return subOrder;
    }

    async getSubOrderByIdOnly(subOrderId: number) {
        const subOrder = await this.repository.getSubOrderById(subOrderId);

        if (!subOrder) {
            throw new Error("SubOrden no encontrada");
        }
        return subOrder;
    }

    async updateSubOrder(orderId: number, subOrderId: number, label: string) {
        const subOrder = await this.getSubOrderById(orderId, subOrderId);
        if (subOrder.status !== "OPEN") {
            throw new Error("No se puede actualizar una sub-orden que ya ha sido pagada, enviada al cajero o cancelada");
        }
        return this.repository.updateSubOrder(subOrderId, label);
    }

    async deleteSubOrder(orderId: number, subOrderId: number) {
        const subOrder = await this.getSubOrderById(orderId, subOrderId);
        if (subOrder.status === "PAID" || subOrder.status === "SENT_TO_CASHIER") {
            throw new Error("No se puede eliminar una sub-orden que ya ha sido pagada o enviada al cajero");
        }
        return this.repository.deleteSubOrder(subOrderId);
    }

    async sendSubOrderToCashier(orderId: number, subOrderId: number) {
        const subOrder = await this.getSubOrderById(orderId, subOrderId);
        if (subOrder.orderItems.length === 0) {
            throw new Error("No se puede enviar al cajero una sub-orden sin productos");
        }
        if (subOrder.status === "SENT_TO_CASHIER") {
            throw new Error("La sub-orden ya ha sido enviada al cajero");
        }
        if (subOrder.status !== "OPEN") {
            throw new Error("No se puede enviar una sub-orden que ya ha sido cancelada o pagada");
        }
        return this.repository.sendSubOrderToCashier(subOrderId);
    }

    async paySubOrder(orderId: number, subOrderId: number) {
        const subOrder = await this.getSubOrderById(orderId, subOrderId);
        if (subOrder.status !== "SENT_TO_CASHIER") {
            throw new Error("No se puede pagar una sub-orden que ya ha sido pagada, cancelada o que no ha sido enviada al cajero");
        }
        return this.repository.paySubOrder(subOrderId);
    }

    async cancelSubOrder(orderId: number, subOrderId: number) {
        const subOrder = await this.getSubOrderById(orderId, subOrderId);
        if (subOrder.status === "PAID") {
            throw new Error("No se puede cancelar una sub-orden que ya ha sido pagada");
        }
        return this.repository.cancelSubOrder(subOrderId);
    }
}
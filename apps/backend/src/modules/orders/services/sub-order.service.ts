import { SubOrderRepository } from "../repositories/sub-order.repository";
import { OrderRepository } from "../repositories/order.repository"; 
import { SubOrderResponse } from "../types/sub-order.types";

export class SubOrderService {

    private subOrderRepository: SubOrderRepository;
    private orderRepository: OrderRepository;

    constructor() {
        this.subOrderRepository = new SubOrderRepository();
        this.orderRepository = new OrderRepository();
    }

    async createSubOrder(orderId: number, label: string): Promise<SubOrderResponse> {
        const order = await this.orderRepository.getOrderById(orderId);
        if (!order) {
            throw new Error("Order no encontrada");
        }
        return this.subOrderRepository.createSubOrder(orderId, label);
    }

    async getSubOrders(orderId: number) {
        const order = await this.orderRepository.getOrderById(orderId);
        if (!order) {
            throw new Error("Order no encontrada");
        }
        return this.subOrderRepository.getSubOrders(orderId);
    }

    async getSubOrderById(orderId: number, subOrderId: number) {
        const subOrder = await this.subOrderRepository.getSubOrderById(subOrderId);

        if (!subOrder) {
            throw new Error("SubOrden no encontrada");
        }
        console.log(subOrder.orderId, orderId);
        if (subOrder.orderId !== orderId) {
            throw new Error("SubOrden no pertenece a la orden");
        }
        return subOrder;
    }

    async updateSubOrder(orderId: number, subOrderId: number, label: string) {
        await this.getSubOrderById(orderId, subOrderId);
        return this.subOrderRepository.updateSubOrder(subOrderId, label);
    }

    async deleteSubOrder(orderId: number, subOrderId: number) {
        await this.getSubOrderById(orderId, subOrderId);
        return this.subOrderRepository.deleteSubOrder(subOrderId);
    }

    async sendSubOrderToCashier(orderId: number, subOrderId: number) {
        await this.getSubOrderById(orderId, subOrderId);
        return this.subOrderRepository.sendSubOrderToCashier(subOrderId);
    }

    async paySubOrder(orderId: number, subOrderId: number) {
        await this.getSubOrderById(orderId, subOrderId);
        return this.subOrderRepository.paySubOrder(subOrderId);
    }

    async cancelSubOrder(orderId: number, subOrderId: number) {
        await this.getSubOrderById(orderId, subOrderId);
        return this.subOrderRepository.cancelSubOrder(subOrderId);
    }
}
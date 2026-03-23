import { SubOrderRepository } from "../repositories/sub-order.repository";
import { SubOrderResponse } from "../types/sub-order.types";

export class SubOrderService {
    private subOrderRepository: SubOrderRepository;

    constructor() {
        this.subOrderRepository = new SubOrderRepository();
    }

    async createSubOrder(orderId: number, label: string): Promise<SubOrderResponse> {
        return this.subOrderRepository.createSubOrder(orderId, label);
    }

    async getSubOrders(orderId: number) {
        return this.subOrderRepository.getSubOrders(orderId);
    }

    async getSubOrderById(orderId: number, subOrderId: number) {
        return this.subOrderRepository.getSubOrderById(orderId, subOrderId);
    }

    async updateSubOrder(orderId: number, subOrderId: number, label: string) {
        return this.subOrderRepository.updateSubOrder(orderId, subOrderId, label);
    }

    async deleteSubOrder(orderId: number, subOrderId: number) {
        return this.subOrderRepository.deleteSubOrder(orderId, subOrderId);
    }

    async sendSubOrderToCashier(orderId: number, subOrderId: number) {
        return this.subOrderRepository.sendSubOrderToCashier(orderId, subOrderId);
    }

    async paySubOrder(orderId: number, subOrderId: number) {
        return this.subOrderRepository.paySubOrder(orderId, subOrderId);
    }

    async cancelSubOrder(orderId: number, subOrderId: number) {
        return this.subOrderRepository.cancelSubOrder(orderId, subOrderId);
    }
}
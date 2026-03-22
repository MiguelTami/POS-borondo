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
}
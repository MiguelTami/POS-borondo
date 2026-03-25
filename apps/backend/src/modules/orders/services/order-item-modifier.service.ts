import { OrderItemModifierRepository } from "../repositories/order-item-modifier.repository";

export class OrderItemModifierService {

    private repository: OrderItemModifierRepository;

    constructor() {
        this.repository = new OrderItemModifierRepository();
    }
}
import { OrderItemModifierService } from "../services/order-item-modifier.service";

export class OrderItemModifierController {

    private service: OrderItemModifierService;

    constructor() {
        this.service = new OrderItemModifierService();
    }
}
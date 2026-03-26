import { OrderItemModifierType, Unit } from "@prisma/client";

export interface CreateOrderItemModifier {
    quantity: number;
    type: OrderItemModifierType;
    ingredientId: number;
}

export interface UpdateOrderItemModifier {
    quantity?: number;
    type?: OrderItemModifierType;
    ingredientId?: number;
}

export interface OrderItemModifierResponse {
    id: number;
    quantity: number;
    type: OrderItemModifierType;
    ingredientId: number;
    ingredient: {
        name: string;
        unit: Unit;
        stock: number;
    }
    orderItemId: number;
    orderItem: {
        subOrderId: number;
        product: {
            name: string;
        }
        subOrder: {
            label: string;
            status: string;
            orderId: number;
        }
    }
}
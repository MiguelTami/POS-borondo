export interface CreateOrderItemDTO {
    productId: number;
    quantity: number;
    notes?: string;
    unitPrice: number;
    totalPrice: number;
}

export interface UpdateOrderItemDTO {
    productId?: number;
    quantity?: number;
    notes?: string;
    unitPriceSnapshot?: number;
    totalPriceSnapshot?: number;
}

export interface CreateItemRequest {
    productId: number;
    quantity: number;
    notes?: string;
}

export interface UpdateItemRequest {
    productId?: number;
    quantity?: number;
    notes?: string;
}

export interface ResponseOrderItem {
    id: number;
    quantity: number;
    notes?: string;
    unitPriceSnapshot: number;
    totalPriceSnapshot: number;
    subOrderId: number;
    productId: number;
    product: {
        name: string;
    };
    subOrder: {
        label: string;
        status: string;
        orderId: number;
    };
}
export interface CreateOrderItemDTO {
    productId: number;
    quantity: number;
    notes?: string;
    unitPrice: number;
    totalPrice: number;
}

export interface CreateItemRequest {
    productId: number;
    quantity: number;
    notes?: string;
}

export interface ResponseOrderItem {
    id: number;
    quantity: number;
    notes?: string;
    unitPrice: number;
    totalPrice: number;
    product: {
        id: number;
        name: string;
        price: number;
    };
    subOrder: {
        id: number;
        label: string;
    };
}
import { OrderStatus, Role } from "@prisma/client";

export interface CreateOrderDTO {
    tableId: number;
    waiterId: number;
}

export interface updateStatusDTO {
    status: OrderStatus;
}

export interface UpdateOrderDTO {
    tableId?: number;
    waiterId?: number;
}

export interface OrderResponse {
    id: number;
    dailyOrderNumber: number;
    businessDate: Date;
    status: OrderStatus;
    table: {
        id: number;
        number: number;
    };
    waiter: {
        id: number;
        name: string;
        role: Role;
    };
}
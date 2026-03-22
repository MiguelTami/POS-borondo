import { OrderStatus, TableStatus } from "@prisma/client";

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
        number: number;
        status: TableStatus;
    };
    waiter: {
        id: number;
        name: string;
    };
}
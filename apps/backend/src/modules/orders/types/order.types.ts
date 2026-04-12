import { OrderStatus, TableStatus } from "@prisma/client";

export interface CreateOrderDTO {
    tableId: number;
    waiterId: number;
    shiftId?: number;
}

export interface UpdateOrderDTO {
    tableId?: number;
    waiterId?: number;
}

export interface OrderResponse {
    id: number;
    dailyOrderNumber: number;
    status: OrderStatus;
    tableId: number;
    table: {
        number: number;
        status: TableStatus;
    };
    waiterId: number;
    waiter: {
        name: string;
    };
    subOrders?: {
        id: number;
        label: string;
        status: string;
    }[];
}
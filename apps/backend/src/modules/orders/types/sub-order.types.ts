import { number } from "joi";

export interface CreateSubOrderDTO {
    label: string;
}

export interface SubOrderResponse {
    id: number;
    label: string;
    status: string;
    order: {
        dailyOrderNumber: number;
        businessDate: Date;
        table: {
            number: number;
        };
        waiter: {
            name: string;
        };
    };
}
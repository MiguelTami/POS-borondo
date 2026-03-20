import { TableStatus } from "@prisma/client";

export interface UpdateTableDTO {
    number?: number;
    status?: TableStatus;
}

export interface TableResponse {
    id: number;
    number: number;
    status: TableStatus;
    createdAt: Date;
}

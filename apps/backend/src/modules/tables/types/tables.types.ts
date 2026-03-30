import { TableStatus } from "@prisma/client";

export interface UpdateTableDTO {
    number?: number;
    status?: TableStatus;
}

export interface TableResponse {
    id: number;
    number: number;
    status: TableStatus;
}

export interface GetTablesQueryDTO {
  page?: number;
  limit?: number;
  status?: TableStatus;
  number?: number;
  hasOpenOrder?: boolean;
  sortBy?: 'number' | 'status';
  sortOrder?: 'asc' | 'desc';
}

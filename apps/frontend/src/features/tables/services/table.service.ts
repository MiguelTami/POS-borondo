import api from "../../../services/api";
import type {
  CreateTablePayload,
  UpdateTablePayload,
  Table,
} from "../types/table.types";

export const tableService = {
  getTables: async (): Promise<Table[]> => {
    const response = await api.get<Table[]>("/tables");
    return response.data;
  },

  createTable: async (payload: CreateTablePayload): Promise<Table> => {
    const response = await api.post<Table>("/tables", payload);
    return response.data;
  },

  updateTable: async (
    id: number,
    payload: UpdateTablePayload,
  ): Promise<Table> => {
    const response = await api.patch<Table>(`/tables/${id}`, payload);
    return response.data;
  },

  deleteTable: async (id: number): Promise<void> => {
    await api.delete(`/tables/${id}`);
  },
};

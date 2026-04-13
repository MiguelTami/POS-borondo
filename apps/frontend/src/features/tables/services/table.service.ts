import api from "../../../services/api";

export interface Table {
  id: number;
  number: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "OUT_OF_SERVICE";
}

export const tableService = {
  getTables: async (): Promise<Table[]> => {
    // maybe pass ?status=AVAILABLE
    const response = await api.get<Table[]>("/tables");
    return response.data;
  },
};

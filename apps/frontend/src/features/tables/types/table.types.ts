export interface Table {
  id: number;
  number: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "OUT_OF_SERVICE";
  createdAt: string;
}

export interface CreateTablePayload {
  number: number;
  status?: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "OUT_OF_SERVICE";
}

export interface UpdateTablePayload {
  number?: number;
  status?: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "OUT_OF_SERVICE";
}

// GetTablesResponse is just Table[]
export type GetTablesResponse = Table[];

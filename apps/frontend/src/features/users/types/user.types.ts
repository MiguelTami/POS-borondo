export interface User {
  id: number;
  name: string;
  role: "ADMIN" | "CASHIER" | "WAITER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  password?: string;
  role: "ADMIN" | "CASHIER" | "WAITER";
}

export interface UpdateUserPayload {
  name?: string;
  password?: string;
  role?: "ADMIN" | "CASHIER" | "WAITER";
}

// GetUsersResponse is just User[]
export type GetUsersResponse = User[];

import api from "../../../services/api";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "../types/user.types";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  createUser: async (payload: CreateUserPayload): Promise<User> => {
    const response = await api.post<User>("/users", payload);
    return response.data;
  },

  updateUser: async (id: number, payload: UpdateUserPayload): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, payload);
    return response.data;
  },

  activateUser: async (id: number): Promise<User> => {
    const response = await api.patch<{ user: User }>(`/users/${id}/activate`);
    return response.data.user;
  },

  deactivateUser: async (id: number): Promise<User> => {
    const response = await api.delete<{ user: User }>(`/users/${id}`);
    return response.data.user;
  },
};

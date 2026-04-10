import api from "../../../services/api";
import type { User } from "../slices/authStore";

export interface LoginPayload {
  name: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const loginUsuario = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post("/users/auth/login", payload);
  // Asumiendo que el backend retorna { user: { id... }, token: "..." }
  // Ajustar si la estructura de desestructuración del back es distinta.
  return data;
};

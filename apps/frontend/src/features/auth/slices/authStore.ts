import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  role: "ADMIN" | "CASHIER" | "WAITER";
  status: "ACTIVE" | "INACTIVE";
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "borondo-auth", // Guardar el token en sessionStorage
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

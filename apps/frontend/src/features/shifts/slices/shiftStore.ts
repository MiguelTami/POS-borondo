import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Shift } from "../services/shift.service";

interface ShiftState {
  activeShift: Shift | null;
  isLoading: boolean;
  setActiveShift: (shift: Shift | null) => void;
  setLoading: (loading: boolean) => void;
  closeShift: () => void;
}

export const useShiftStore = create<ShiftState>()(
  persist(
    (set) => ({
      activeShift: null,
      isLoading: true,
      setActiveShift: (shift) => set({ activeShift: shift, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      closeShift: () => set({ activeShift: null }),
    }),
    {
      name: "borondo-shift",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

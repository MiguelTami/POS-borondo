import api from "../../../services/api";

export interface Shift {
  id: number;
  startTime: string;
  endTime: string | null;
  openedById: number;
  closedById: number | null;
  totalSales: number;
  declaredCash: number | null;
  difference: number | null;
  status: "OPEN" | "CLOSED";
}

export const shiftService = {
  getActiveShift: async (): Promise<Shift | null> => {
    try {
      const response = await api.get<Shift>("/shifts/active");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  openShift: async (): Promise<Shift> => {
    const response = await api.post<Shift>("/shifts/open");
    return response.data;
  },

  closeShift: async (shiftId: number, declaredCash: number): Promise<Shift> => {
    const response = await api.post<Shift>(`/shifts/${shiftId}/close`, {
      declaredCash,
    });
    return response.data;
  },
};

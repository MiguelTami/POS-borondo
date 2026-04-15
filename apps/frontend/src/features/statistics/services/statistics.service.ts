import api from "../../../services/api";
import type {
  SummaryData,
  TopProduct,
  TopIngredient,
  ShiftOrdersResponse,
  StatisticsFilters,
} from "../types/statistics.types";

export const statisticsService = {
  getSummary: async (params?: StatisticsFilters): Promise<SummaryData> => {
    const response = await api.get<SummaryData>("/statistics/summary", {
      params,
    });
    return response.data;
  },

  getTopProducts: async (params?: StatisticsFilters): Promise<TopProduct[]> => {
    const response = await api.get<TopProduct[]>("/statistics/top-products", {
      params,
    });
    return response.data;
  },

  getTopIngredients: async (
    params?: StatisticsFilters,
  ): Promise<TopIngredient[]> => {
    const response = await api.get<TopIngredient[]>(
      "/statistics/top-ingredients",
      { params },
    );
    return response.data;
  },

  getShiftOrders: async (shiftId: number): Promise<ShiftOrdersResponse> => {
    const response = await api.get<ShiftOrdersResponse>(
      `/statistics/shifts/${shiftId}/orders`,
    );
    return response.data;
  },
};

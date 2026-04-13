import api from "../../../services/api";

export interface Ingredient {
  id: number;
  name: string;
  unit: "UNIT" | "GRAM" | "KILOGRAM" | "MILLILITER" | "LITER";
  minStockAlert: number;
  stock: number;
  isActive: boolean;
}

export type CreateIngredientDTO = Omit<Ingredient, "id" | "stock" | "isActive">;
export type UpdateIngredientDTO = Partial<CreateIngredientDTO>;

export interface AdjustStockDTO {
  ingredientId: number;
  type: "RESTOCK" | "WASTE" | "MANUAL_ADJUSTMENT";
  quantity: number;
}

export const inventoryService = {
  getAllIngredients: async (): Promise<Ingredient[]> => {
    const response = await api.get<Ingredient[]>("/ingredients/all");
    return response.data;
  },

  createIngredient: async (data: CreateIngredientDTO): Promise<Ingredient> => {
    const response = await api.post<Ingredient>("/ingredients", data);
    return response.data;
  },

  updateIngredient: async (
    id: number,
    data: UpdateIngredientDTO,
  ): Promise<Ingredient> => {
    const response = await api.patch<Ingredient>(`/ingredients/${id}`, data);
    return response.data;
  },

  adjustStock: async (data: AdjustStockDTO) => {
    const response = await api.post("/inventory/movements/adjust", data);
    return response.data;
  },

  deactivateIngredient: async (id: number) => {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  },

  activateIngredient: async (id: number) => {
    const response = await api.patch(`/ingredients/${id}/reactivate`);
    return response.data;
  },
};

export interface InventoryMovementQueryDTO {
  type?: "SALE_DEDUCTION" | "RESTOCK" | "WASTE" | "MANUAL_ADJUSTMENT";
  ingredientId?: number;
  page?: number;
  limit?: number;
}

export interface CreateAdjustmentDTO {
  ingredientId: number;
  type: "RESTOCK" | "WASTE" | "MANUAL_ADJUSTMENT";
  quantity: number;
}

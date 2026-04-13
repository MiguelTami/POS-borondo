import api from "../../../services/api";

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  categoryId: number;
  recipes?: {
    quantityRequired: number | string;
    ingredient: {
      stock: number | string;
      name: string;
    };
  }[];
}

export const productService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories/all");
    return response.data;
  },
  getProducts: async (categoryId?: number): Promise<Product[]> => {
    const params = categoryId
      ? { categoryId, isActive: true }
      : { isActive: true };
    const response = await api.get<Product[]>("/products", { params });
    return response.data;
  },
};

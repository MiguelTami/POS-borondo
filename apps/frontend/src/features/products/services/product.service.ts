import api from "../../../services/api";

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Recipe {
  id: number;
  quantityRequired: number;
  ingredientId: number;
  ingredient: {
    name: string;
    unit: string;
    stock: number;
  };
}

export interface Product {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  categoryId: number;
  category?: {
    name: string;
  };
  recipes?: Recipe[];
}

export interface CreateProductDTO {
  name: string;
  price: number;
  categoryId: number;
}

export interface CreateRecipeDTO {
  ingredientId: number;
  quantityRequired: number;
}

export const productService = {
  // --- Products ---
  getProducts: async (params?: {
    categoryId?: number;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<Product[]>("/products", { params });
    return response.data;
  },

  createProduct: async (data: CreateProductDTO): Promise<Product> => {
    const response = await api.post<Product>("/products", data);
    return response.data;
  },

  updateProduct: async (
    id: number,
    data: Partial<CreateProductDTO>,
  ): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  deactivateProduct: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  reactivateProduct: async (id: number) => {
    const response = await api.patch(`/products/${id}/reactivate`);
    return response.data;
  },

  // --- Categories ---
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories/all");
    return response.data;
  },

  createCategory: async (name: string): Promise<Category> => {
    const response = await api.post<Category>("/categories", { name });
    return response.data;
  },

  // --- Recipes ---
  getRecipes: async (productId: number): Promise<Recipe[]> => {
    const response = await api.get<Recipe[]>(`/products/${productId}/recipes`);
    return response.data;
  },

  createRecipe: async (
    productId: number,
    data: CreateRecipeDTO,
  ): Promise<Recipe> => {
    const response = await api.post<Recipe>(
      `/products/${productId}/recipes`,
      data,
    );
    return response.data;
  },

  updateRecipe: async (
    recipeId: number,
    data: Partial<CreateRecipeDTO>,
  ): Promise<Recipe> => {
    const response = await api.patch<Recipe>(`/recipes/${recipeId}`, data);
    return response.data;
  },

  deleteRecipe: async (recipeId: number) => {
    const response = await api.delete(`/recipes/${recipeId}`);
    return response.data;
  },
};

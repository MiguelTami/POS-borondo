export interface CreateProductDTO {
  name: string;
  price: number;
  categoryId: number;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  categoryId?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  categoryId: number;
  category: {
    name: string;
  };
}

export interface DeleteProductResponse {
  message: string;
}

export interface GetProductQueryDTO {
  categoryId?: number,
  isActive?: boolean,
  search?: string,
  page?: number,
  limit?: number
}
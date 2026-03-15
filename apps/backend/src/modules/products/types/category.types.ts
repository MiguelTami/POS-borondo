export interface UpdateCategoryDTO {
  name?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  id: number;
  name: string;
  isActive: boolean;
}

export interface DeleteCategoryResponse {
  message: string;
}
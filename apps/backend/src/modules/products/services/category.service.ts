import { CategoriesRepository } from '../repositories/category.repository';
import { CategoryResponse, UpdateCategoryDTO, DeleteCategoryResponse } from '../types/category.types';

export class CategoriesService {

    private repository: CategoriesRepository;

    constructor() {
        this.repository = new CategoriesRepository();
    }

    async createCategory (name: string): Promise<CategoryResponse> {
        const categoryName = await this.repository.createCategory(name)
        
        return categoryName
    }

    async getCategories () {
        const categories = await this.repository.getCategories()

        return categories
    }

    async getCategoryById (id: number) {
        const category = await this.repository.getCategoryById(id)

        return category
    }

    async updateCategory (id: number, data: UpdateCategoryDTO): Promise<CategoryResponse> {
        const categoryUpdated = await this.repository.updateCategory(id, data)

        return categoryUpdated
    }

    async desactivateCategory (id: number): Promise<DeleteCategoryResponse> {
        await this.repository.desactivateCategory(id)
        
        return {
            message: 'Category desactivated successfully'
        }
    }

    async reactivateCategory (id: number): Promise<DeleteCategoryResponse> {
        await this.repository.desactivateCategory(id)
        
        return {
            message: 'Category reactivated successfully'
        }
    }
}
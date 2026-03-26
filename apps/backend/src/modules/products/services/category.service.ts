import { CategoriesRepository } from '../repositories/category.repository';
import { CategoryResponse, DeleteCategoryResponse } from '../types/category.types';

export class CategoriesService {

    private repository: CategoriesRepository;

    constructor() {
        this.repository = new CategoriesRepository();
    }

    async createCategory (name: string): Promise<CategoryResponse> {
        const existingCategory = await this.repository.getCategoryByName(name);

        if (existingCategory) {
            throw new Error('La categoría ya existe');
        }

        return await this.repository.createCategory(name);
    }

    async getActiveCategories () {
        const categories = await this.repository.getActiveCategories()

        if (categories.length === 0) {
            throw new Error('No hay categorías activas');
        }

        return categories
    }

    async getAllCategories () {
        const categories = await this.repository.getAllCategories()

        if (categories.length === 0) {
            throw new Error('No hay categorías registradas');
        }

        return categories
    }

    async getCategoryById (id: number) {
        const category = await this.repository.getCategoryById(id)

        if (!category) {
            throw new Error('La categoría no existe');
        }

        return category
    }

    async updateCategory (id: number, name: string): Promise<CategoryResponse> {
        await this.getCategoryById(id)
        const existingCategory = await this.repository.getCategoryByName(name);
        if (existingCategory && existingCategory.id !== id) {
            throw new Error('Ya existe una categoría con el nombre: ' + name);
        }
        const categoryUpdated = await this.repository.updateCategory(id, name)

        return categoryUpdated
    }

    async desactivateCategory (id: number): Promise<DeleteCategoryResponse> {
        const category = await this.getCategoryById(id)

        if (!category.isActive) {
            throw new Error('La categoría ya está inactiva');
        }

        await this.repository.desactivateCategory(id)
        
        return {
            message: 'Categoría desactivada correctamente'
        }
    }

    async reactivateCategory (id: number): Promise<DeleteCategoryResponse> {
        const category = await this.getCategoryById(id)

        if (category.isActive) {
            throw new Error('La categoría ya está activa');
        }

        await this.repository.reactivateCategory(id)
        
        return {
            message: 'Categoría reactivada correctamente'
        }
    }
}
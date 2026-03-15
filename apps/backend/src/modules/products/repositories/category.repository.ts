import { prisma } from '../../../config/prisma';
import { UpdateCategoryDTO } from '../types/category.types';

export class CategoriesRepository {
    async createCategory (name: string) {
        return prisma.category.create({
            data: {name, 
                isActive: true
            }
        })
    }

    async getCategoryById (id: number) {
        return prisma.category.findUnique({
            where: {id}
        })
    }

    async getCategories () {
        return prisma.category.findMany({
            where: { isActive: true },
            orderBy: {name: 'asc'}
        })
    }

    async updateCategory (id: number, data: UpdateCategoryDTO)  {
        return prisma.category.update({
            where: {id},
            data: data
        })
    }

    async desactivateCategory (id: number) {
        return prisma.category.update({
            where: {id},
            data: {isActive: false}
        })
    }

    async reactivateCategory (id: number) {
        return prisma.category.update({
            where: {id},
            data: {isActive: true}
        })
    }
}
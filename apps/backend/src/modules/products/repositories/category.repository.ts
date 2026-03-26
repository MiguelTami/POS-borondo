import { prisma } from '../../../config/prisma';

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

    async getCategoryByName (name: string) {
        return prisma.category.findFirst({
            where: {name}
        })
    }

    async getActiveCategories () {
        return prisma.category.findMany({
            where: { isActive: true },
            orderBy: {name: 'asc'}
        })
    }

    async getAllCategories () {
        return prisma.category.findMany({
            orderBy: {name: 'asc'}
        })
    }

    async updateCategory (id: number, name: string)  {
        return prisma.category.update({
            where: {id},
            data: {name}
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
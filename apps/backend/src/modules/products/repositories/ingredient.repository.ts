import { prisma }   from '../../../config/prisma';
import { CreateIngredientDTO, UpdateIngredientDTO } from '../types/ingredient.types';

export class IngredientsRepository {

    async getActiveIngredients () {
        return prisma.ingredient.findMany({
            where: {isActive: true},
            orderBy: {name: 'asc'},
            select: {id: true, name: true, unit: true, stock: true, minStockAlert: true}
        })
    }

    async getAllIngredients () {
        return prisma.ingredient.findMany({
            orderBy: {name: 'asc'},
            select: {id: true, name: true, unit: true, stock: true, minStockAlert: true, isActive: true}
        })
    }

    async getIngredientById (id: number) {
        return prisma.ingredient.findUnique({
            where: {id},
            select: {id: true, name: true, unit: true, stock: true, minStockAlert: true, isActive: true}
        })
    }

    async getIngredientByName (name: string) {
        return prisma.ingredient.findFirst({
            where: {name}
        })
    }

    async createIngredient (data: CreateIngredientDTO) {
        return prisma.ingredient.create({
            data: {
                name: data.name,
                unit: data.unit,
                stock: data.stock || 0,
                minStockAlert: data.minStockAlert,
                isActive: true
            },
            select: {id: true, name: true, unit: true, stock: true, minStockAlert: true, isActive: true}
        })
    }

    async updateIngredient (id: number, data: UpdateIngredientDTO) {
        return prisma.ingredient.update({
            where: {id},
            data,
            select: {id: true, name: true, unit: true, stock: true, minStockAlert: true, isActive: true}
        })
    }

    async disactivateIngredient (id: number) {
        return prisma.ingredient.update({
            where: {id},
            data: {isActive: false}
        })
    }

    async activateIngredient (id: number) {
        return prisma.ingredient.update({
            where: {id},
            data: {isActive: true}
        })
    }
}
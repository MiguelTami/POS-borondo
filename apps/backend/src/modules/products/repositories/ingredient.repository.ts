import { prisma }   from '../../../config/prisma';
import { CreateIngredientDTO, IngredientResponse, UpdateIngredientDTO } from '../types/ingredient.types';

export class IngredientsRepository {

    async getIngredients () {
        return prisma.ingredient.findMany({
            where: {isActive: true},
            orderBy: {name: 'asc'}
        })
    }

    async getIngredientById (id: number) {
        return prisma.ingredient.findUnique({
            where: {id}
        })
    }

    async createIngredient (data: CreateIngredientDTO) {
        return prisma.ingredient.create({
            data: {
                name: data.name,
                unit: data.unit,
                stock: 0,
                minStockAlert: data.minStockAlert,
                isActive: true
            }
        })
    }

    async updateIngredient (id: number, data: UpdateIngredientDTO) {
        return prisma.ingredient.update({
            where: {id},
            data: data
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
import { prisma } from '../../../config/prisma';
import { CreateRecipeDTO, UpdateRecipeDTO } from '../types/recipe.types';

export class RecipesRepository{

    async getRecipeById(id: number) {
        return prisma.recipe.findUnique({
            where: {id}
        })
    }

    async getIngredientsRecipe(productId: number) {
        return prisma.recipe.findMany({
            where: {productId},
            include: {
                ingredient: true
            }
        })
    }
    
    async createIngredientRecipe(productId: number, data: CreateRecipeDTO) {
        return prisma.recipe.create({
            data: {
                productId: productId,
                ingredientId: data.ingredientId,
                quantityRequired: data.quantityRequired
            },
            include: {
                ingredient: true,
                product: true
            }
        })
    }

    async updateIngredientRecipe(recipeId: number, data: UpdateRecipeDTO) {
        return prisma.recipe.update({
            where: {id: recipeId},
            data: data,
            include: {
                ingredient: true,
                product: true
            }
        })
    }

    async deleteIngredientRecipe(recipeId: number) {
        return prisma.recipe.delete({
            where: {id: recipeId}
        })
    }
}
import { prisma } from '../../../config/prisma';
import { CreateRecipeDTO, UpdateRecipeDTO } from '../types/recipe.types';

export class RecipesRepository{

    async findById(id: number) {
        return prisma.recipe.findUnique({
            where: {id}
        })
    }
    
    async createIngredientRecipe(data: CreateRecipeDTO) {
        return prisma.recipe.create({
            data: data,
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
}
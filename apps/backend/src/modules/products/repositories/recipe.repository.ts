import { prisma } from '../../../config/prisma';
import { CreateRecipeDTO, UpdateRecipeDTO } from '../types/recipe.types';

export class RecipesRepository{

    async getRecipeById(id: number) {
        return prisma.recipe.findUnique({
            where: {id},
            select: {
                id: true,
                quantityRequired: true,
                ingredientId: true,
                ingredient: {
                    select: {
                        name: true,
                        unit: true
                    }
                },
                productId: true,
                product: {
                    select: {
                        name: true
                    }
                }
            }
        })
    }

    async getIngredientsRecipe(productId: number) {
        return prisma.recipe.findMany({
            where: {productId},
            select: {
                id: true,
                quantityRequired: true,
                ingredientId: true,
                ingredient: {
                    select: {
                        name: true,
                        unit: true
                    }
                },
                productId: true,
                product: {
                    select: {
                        name: true
                    }
                }
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
            select: {
                id: true,
                quantityRequired: true,
                ingredientId: true,
                ingredient: {
                    select: {
                        name: true,
                        unit: true
                    }
                },
                productId: true,
                product: {
                    select: {
                        name: true
                    }
                }
            }
        })
    }

    async updateIngredientRecipe(recipeId: number, data: UpdateRecipeDTO) {
        return prisma.recipe.update({
            where: {id: recipeId},
            data: data,
            select: {
                id: true,
                quantityRequired: true,
                ingredientId: true,
                ingredient: {
                    select: {
                        name: true,
                        unit: true
                    }
                },
                productId: true,
                product: {
                    select: {
                        name: true
                    }
                }
            }
        })
    }

    async deleteIngredientRecipe(recipeId: number) {
        return prisma.recipe.delete({
            where: {id: recipeId}
        })
    }
}
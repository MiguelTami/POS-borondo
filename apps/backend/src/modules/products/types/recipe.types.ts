import { Decimal } from "@prisma/client/runtime/library";

export interface CreateRecipeDTO {
    ingredientId: number,
    quantityRequired: number | Decimal
}

export interface UpdateRecipeDTO {
    ingredientId?: number,
    quantityRequired?: number | Decimal 
}

export interface RecipeResponse {
    product: {
        id: number,
        name: string
    },
    ingredient: {
        id: number,
        name: string
    },
    quantityRequired: number | Decimal
}

export interface DeleteRecipe {
    message: string
}
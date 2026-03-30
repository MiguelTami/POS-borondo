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
    id: number,
    quantityRequired: number | Decimal,
    ingredientId: number,
    ingredient: {
        name: string,
        unit: string
    },
    productId: number,
    product: {
        name: string
    }
}

export interface DeleteRecipe {
    message: string
}
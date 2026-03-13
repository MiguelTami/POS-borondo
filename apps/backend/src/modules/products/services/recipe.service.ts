import { RecipesRepository } from "../repositories/recipe.repository";
import { RecipeResponse, CreateRecipeDTO, UpdateRecipeDTO, DeleteRecipe } from "../types/recipe.types";

export class RecipesService {

    private repository : RecipesRepository;

    constructor() {
        this.repository = new RecipesRepository()
    };

    async getIngredientsRecipe(productId: number) {
        return await this.repository.getIngredientsRecipe(productId)
    }

    async createIngredientRecipe(productId: number, data: CreateRecipeDTO): Promise<RecipeResponse> {
        const ingredientRecipe = await this.repository.createIngredientRecipe(productId, data)

        return {
            product: {
                id: ingredientRecipe.product.id,
                name: ingredientRecipe.product.name
            },
            ingredient: {
                id: ingredientRecipe.ingredient.id,
                name: ingredientRecipe.ingredient.name
            },
            quantityRequired: ingredientRecipe.quantityRequired
        }
    };

    async updateIngredientRecipe(recipeId: number, data: UpdateRecipeDTO): Promise<RecipeResponse> {
        const recipe = await this.repository.findById(recipeId);

        const recipeUpdated = await this.repository.updateIngredientRecipe(recipeId, data)

        return {
            product: {
                id: recipeUpdated.product.id,
                name: recipeUpdated.product.name
            },
            ingredient: {
                id: recipeUpdated.ingredient.id,
                name: recipeUpdated.ingredient.name
            },
            quantityRequired: recipeUpdated.quantityRequired
        }

    }

    async deleteIngredientRecipe(recipeId: number): Promise<DeleteRecipe> {
        await this.repository.deleteIngredientRecipe(recipeId)
        return {
            message: 'The ingredient was deleted from the recipe succesfully'
        }
    }
}
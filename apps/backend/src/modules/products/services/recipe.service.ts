import { RecipesRepository } from "../repositories/recipe.repository";
import { IngredientsRepository } from "../repositories/ingredient.repository";
import { RecipeResponse, CreateRecipeDTO, UpdateRecipeDTO, DeleteRecipe } from "../types/recipe.types";

export class RecipesService {

    private repository : RecipesRepository;
    private ingredientRepository : IngredientsRepository;

    constructor() {
        this.repository = new RecipesRepository();
        this.ingredientRepository = new IngredientsRepository();
    };

    async getIngredientsRecipe(productId: number) {
        return await this.repository.getIngredientsRecipe(productId)
    }

    async createIngredientRecipe(productId: number, data: CreateRecipeDTO): Promise<RecipeResponse> {

        const ingredient = await this.ingredientRepository.getIngredientById(data.ingredientId);
        if (!ingredient || !ingredient.isActive) {
            throw new Error('El ingrediente no existe o está inactivo');
        }
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

        const ingredient = await this.ingredientRepository.getIngredientById(data.ingredientId);
        if (!ingredient || !ingredient.isActive) {
            throw new Error('El ingrediente no existe o está inactivo');
        }

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
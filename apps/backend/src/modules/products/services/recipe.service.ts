import { RecipesRepository } from "../repositories/recipe.repository";
import { RecipeResponse, CreateRecipeDTO, UpdateRecipeDTO } from "../types/recipe.types";

export class RecipesService {

    private repository : RecipesRepository;

    constructor() {
        this.repository = new RecipesRepository()
    };

    async createIngredientRecipe(data: CreateRecipeDTO): Promise<RecipeResponse> {
        const ingredientRecipe = await this.repository.createIngredientRecipe(data)

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

    async updateIngredientRecipe(recipeId: number, productId: number, data: UpdateRecipeDTO) {
        const recipe = await this.repository.findById(recipeId);

        if (!recipe || recipe.productId !== productId) {
            throw new Error('Recipe does not belong to this product')
        }

        return this.repository.updateIngredientRecipe(recipeId, data)
    }
}
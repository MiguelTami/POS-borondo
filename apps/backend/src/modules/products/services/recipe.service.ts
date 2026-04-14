import { RecipesRepository } from "../repositories/recipe.repository";
import { IngredientsService } from "./ingredient.service";
import { ProductsService } from "./product.service";
import { RecipeResponse, CreateRecipeDTO, UpdateRecipeDTO, DeleteRecipe } from "../types/recipe.types";

export class RecipesService {

    private repository : RecipesRepository;
    private ingredientService : IngredientsService;
    private productService : ProductsService;


    constructor() {
        this.repository = new RecipesRepository();
        this.ingredientService = new IngredientsService();
        this.productService = new ProductsService();

    };

    async getRecipeById(id: number) {
        const recipe = await this.repository.getRecipeById(id);
        if (!recipe) {
            throw new Error('Receta no encontrada');
        }
        return recipe;
    }


    async getIngredientsRecipe(productId: number) {
        const product = await this.productService.getProductById(productId);
        
        if (!product.isActive) {
            throw new Error('El producto está inactivo');
        }

        const ingredientsList = await this.repository.getIngredientsRecipe(productId);

        if (ingredientsList.length === 0) {
            return [];
        }

        return ingredientsList;
    }

    async getIngredientsProduct(productId: number, ingredientId: number) {
        return await this.repository.getIngredientsProduct(productId, ingredientId)
    }

    async createIngredientRecipe(productId: number, data: CreateRecipeDTO): Promise<RecipeResponse> {

        const product = await this.productService.getProductById(productId);

        if (!product.isActive) {
            throw new Error('El producto está inactivo');
        }
        
        const ingredient = await this.ingredientService.getIngredientById(data.ingredientId);
        if (!ingredient.isActive) {
            throw new Error('El ingrediente está inactivo');
        }

        const recipe = await this.repository.getIngredientsRecipe(productId);
        const ingredientAlreadyInRecipe = recipe.some(r => r.ingredientId === data.ingredientId);

        if (ingredientAlreadyInRecipe) {
            throw new Error('El ingrediente ya forma parte de la receta de este producto');
        }

        const ingredientRecipe = await this.repository.createIngredientRecipe(productId, data)

        return ingredientRecipe
    };

    async updateIngredientRecipe(recipeId: number, data: UpdateRecipeDTO): Promise<RecipeResponse> {

        const currentRecipe = await this.getRecipeById(recipeId);
        
        if (data.ingredientId !== undefined && data.ingredientId !== currentRecipe.ingredientId) {
            const ingredient = await this.ingredientService.getIngredientById(data.ingredientId);
            if (!ingredient || !ingredient.isActive) {
                throw new Error('El ingrediente está inactivo');
            }

            const productRecipes = await this.repository.getIngredientsRecipe(currentRecipe.productId);
            const ingredientAlreadyInRecipe = productRecipes.some(r => r.ingredientId === data.ingredientId);

            if (ingredientAlreadyInRecipe) {
                throw new Error('El ingrediente ya forma parte de la receta de este producto');
            }
        }

        const recipeUpdated = await this.repository.updateIngredientRecipe(recipeId, data)

        return recipeUpdated

    }

    async deleteIngredientRecipe(recipeId: number): Promise<DeleteRecipe> {
        await this.getRecipeById(recipeId);

        await this.repository.deleteIngredientRecipe(recipeId)
        return {
            message: 'El ingrediente fue eliminado de la receta exitosamente'
        }
    }
}
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
            throw new Error('EL producto no tiene ingredientes asociados');
        }

        return await this.repository.getIngredientsRecipe(productId)
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
        const ingredientRecipe = await this.repository.createIngredientRecipe(productId, data)

        return {
            product: {
                id: ingredientRecipe.product.id,
                name: ingredientRecipe.product.name
            },
            ingredient: {
                id: ingredientRecipe.ingredient.id,
                name: ingredientRecipe.ingredient.name,
                unit: ingredientRecipe.ingredient.unit
            },
            quantityRequired: ingredientRecipe.quantityRequired
        }
    };

    async updateIngredientRecipe(recipeId: number, data: UpdateRecipeDTO): Promise<RecipeResponse> {

        await this.getRecipeById(recipeId);
        
        if (data.ingredientId !== undefined) {
            const ingredient = await this.ingredientService.getIngredientById(data.ingredientId);
            if (!ingredient || !ingredient.isActive) {
                throw new Error('El ingrediente está inactivo');
            }
        }

        const recipeUpdated = await this.repository.updateIngredientRecipe(recipeId, data)

        return {
            product: {
                id: recipeUpdated.product.id,
                name: recipeUpdated.product.name
            },
            ingredient: {
                id: recipeUpdated.ingredient.id,
                name: recipeUpdated.ingredient.name,
                unit: recipeUpdated.ingredient.unit
            },
            quantityRequired: recipeUpdated.quantityRequired
        }

    }

    async deleteIngredientRecipe(recipeId: number): Promise<DeleteRecipe> {
        await this.getRecipeById(recipeId);

        await this.repository.deleteIngredientRecipe(recipeId)
        return {
            message: 'El ingrediente fue eliminado de la receta exitosamente'
        }
    }
}
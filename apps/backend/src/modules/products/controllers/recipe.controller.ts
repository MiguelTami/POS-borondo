import { RecipesService } from "../services/recipe.service";
import { CreateRecipeDTO, UpdateRecipeDTO } from "../types/recipe.types";
import { Request, Response } from 'express'

export class RecipesController {

    private service: RecipesService;

    constructor() {
        this.service = new RecipesService()
    };

    createIngredientRecipe = async (req: Request, res: Response) => {
        try {
            const productId = Number(req.params.productId);
            const info = req.body;
            const data: CreateRecipeDTO = {
                ingredientId: info.ingredientId,
                quantityRequired: info.quantityRequired
            }
            const ingredientRecipe = await this.service.createIngredientRecipe(productId,data);

            res.status(201).json(ingredientRecipe)
        } catch (error) {
            res.status(500).json({
                message: 'Error creating Recipe'
            })
        }
    }

    updateIngredientRecipe = async (req: Request, res: Response) => {
        try {
            const data: UpdateRecipeDTO = req.body;
            const productId = req.params.productId;
            const recipeId = req.params.recipeId;
            
            const recipeUpdated = await this.service.updateIngredientRecipe(recipeId, productId, data)

            res.status(200).json(recipeUpdated)
        } catch (error) {
            res.status(500).json({
                message: 'Error updating Recipe'
            })
        }
    }
}
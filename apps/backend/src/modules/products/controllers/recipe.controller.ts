import { RecipesService } from "../services/recipe.service";
import { CreateRecipeDTO, UpdateRecipeDTO } from "../types/recipe.types";
import { Request, Response } from 'express'

export class RecipesController {

    private service: RecipesService;

    constructor() {
        this.service = new RecipesService()
    };

    getIngredientsRecipe = async (req: Request, res: Response) => {
        try {
            const productId = req.params.productId
            const ingredientsList = await this.service.getIngredientsRecipe(productId)

            res.status(200).json(ingredientsList)
        } catch (error) {
           res.status(500).json({
                message: 'Error fetching ingredients from Recipe'
            }) 
        }
    }

    createIngredientRecipe = async (req: Request, res: Response) => {
        try {
            const productId = req.params.productId;
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
            const recipeId = req.params.recipeId;
            
            const recipeUpdated = await this.service.updateIngredientRecipe(recipeId, data)

            res.status(200).json(recipeUpdated)
        } catch (error) {
            res.status(500).json({
                message: 'Error updating Recipe'
            })
        }
    }

    deleteIngredientrecipe = async (req: Request, res: Response) => {
        try {
            const recipeId = req.params.recipeId
            
            const result = await this.service.deleteIngredientRecipe(recipeId)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting ingredient from Recipe'
            })
        }
    }
}
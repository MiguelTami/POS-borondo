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
            const productId = req.validatedParams.productId
            const ingredientsList = await this.service.getIngredientsRecipe(productId)

            res.status(200).json(ingredientsList)
        } catch (error) {
            if (error.message === 'El producto está inactivo' || 
                error.message === 'Producto no encontrado') {
                return res.status(400).json({ message: error.message });
            }
           res.status(500).json({
                message: 'Error fetching ingredients from Recipe'
            }) 
        }
    }

    createIngredientRecipe = async (req: Request, res: Response) => {
        try {
            const productId = req.validatedParams.productId;
            const info = req.validatedBody;
            const data: CreateRecipeDTO = {
                ingredientId: info.ingredientId,
                quantityRequired: info.quantityRequired
            }
            const ingredientRecipe = await this.service.createIngredientRecipe(productId,data);

            res.status(201).json(ingredientRecipe)
        } catch (error) {
            if (error.message === 'El ingrediente está inactivo' || 
                error.message === 'Ingrediente no encontrado' || 
                error.message === 'El producto está inactivo' ||
                error.message === 'Producto no encontrado' ||
                error.message === 'El ingrediente ya forma parte de la receta de este producto') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({
                message: 'Error creating Recipe'
            })
        }
    }

    updateIngredientRecipe = async (req: Request, res: Response) => {
        try {
            const data: UpdateRecipeDTO = req.validatedBody;
            const recipeId = req.validatedParams.recipeId;

            const recipeUpdated = await this.service.updateIngredientRecipe(recipeId, data)

            res.status(200).json(recipeUpdated)
        } catch (error) {
            if (error.message === 'El ingrediente está inactivo' ||
                error.message === 'Ingrediente no encontrado' ||
                error.message === 'Receta no encontrada' ||
                error.message === 'El ingrediente ya forma parte de la receta de este producto') {
                return res.status(400).json({ message: error.message });
            }
            console.error(error.message)
            res.status(500).json({
                message: 'Error updating Recipe'
            })
        }
    }

    deleteIngredientrecipe = async (req: Request, res: Response) => {
        try {
            const recipeId = req.validatedParams.recipeId
            
            const result = await this.service.deleteIngredientRecipe(recipeId)

            res.status(200).json(result)
        } catch (error) {
            if (error.message === 'Receta no encontrada') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({
                message: 'Error deleting ingredient from Recipe'
            })
        }
    }
}
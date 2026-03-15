import { Request, Response } from 'express'
import { IngredientsService } from '../services/ingredient.service'
import { CreateIngredientDTO, UpdateIngredientDTO } from '../types/ingredient.types';

export class IngredientsController {

    private service: IngredientsService;
    
    constructor() {
        this.service = new IngredientsService()
    }

    getIngredients = async (req: Request, res: Response) => {
        try {
            const ingredients = await this.service.getIngredients()

            res.status(200).json(ingredients)
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching ingredients'
            })
        }        
    }

    getIngredientById = async (req: Request, res: Response) => {
        try {
            const ingredientId = Number(req.params.id)
            const ingredient = await this.service.getIngredientById(ingredientId)

            res.status(200).json(ingredient)
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching ingredient'
            })
        }
    }

    createIngredient = async (req: Request, res: Response) => {
        try {
            const data: CreateIngredientDTO = req.body
            const ingredient = await this.service.createIngredient(data)

            res.status(201).json(ingredient)
        } catch (error) {
            res.status(500).json({
                message: 'Error creating ingredient'
            })
        }
    }

    updateIngredient = async (req: Request, res: Response) => {
        try {
            const ingredientId = Number(req.params.id);
            const dataIngredient: UpdateIngredientDTO = req.body;

            const ingredientUpdated = await this.service.updateIngredient(ingredientId, dataIngredient)

            res.status(200).json(ingredientUpdated)
        } catch (error) {
            res.status(500).json({
                message: 'Error updating ingredient'
            })
        }
    }

    disactivateIngredient = async (req: Request, res: Response) => {
        try {
            const ingredientId = Number(req.params.id);
            const result = await this.service.disactivateIngredient(ingredientId)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({
                message: 'Error deactivating ingredient'
            })
        }
    }

    activateIngredient = async (req: Request, res: Response) => {
        try {
            const ingredientId = Number(req.params.id);
            const result = await this.service.activateIngredient(ingredientId)

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({
                message: 'Error activating ingredient'
            })
        }
    }
}
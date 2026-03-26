import { Request, Response } from 'express'
import { IngredientsService } from '../services/ingredient.service'
import { CreateIngredientDTO, UpdateIngredientDTO } from '../types/ingredient.types';

export class IngredientsController {

    private service: IngredientsService;
    
    constructor() {
        this.service = new IngredientsService()
    }

    getActiveIngredients = async (req: Request, res: Response) => {
        try {
            const ingredients = await this.service.getActiveIngredients()

            res.status(200).json(ingredients)
        } catch (error) {
            if (error.message === 'No hay ingredientes activos') {
                return res.status(404).json({
                    message: error.message
                })
            }
            res.status(500).json({
                message: 'Error fetching ingredients'
            })
        }        
    }

    getAllIngredients = async (req: Request, res: Response) => {
        try {
            const ingredients = await this.service.getAllIngredients()

            res.status(200).json(ingredients)
        } catch (error) {
            if (error.message === 'No hay ingredientes registrados') {
                return res.status(404).json({
                    message: error.message
                })
            }
            res.status(500).json({
                message: 'Error fetching ingredients'
            })
        }
    }

    getIngredientById = async (req: Request, res: Response) => {
        try {
            const ingredientId = req.validatedParams.ingredientId
            const ingredient = await this.service.getIngredientById(ingredientId)

            res.status(200).json(ingredient)
        } catch (error) {
            if (error.message === 'Ingrediente no encontrado') {
                return res.status(404).json({
                    message: error.message
                })
            }
            res.status(500).json({
                message: 'Error fetching ingredient'
            })
        }
    }

    createIngredient = async (req: Request, res: Response) => {
        try {
            const data: CreateIngredientDTO = req.validatedBody
            const ingredient = await this.service.createIngredient(data)

            res.status(201).json(ingredient)
        } catch (error) {
            if (error.message.startsWith('Ya existe un ingrediente con el nombre')) {
                return res.status(400).json({
                    message: error.message
                })
            }
            res.status(500).json({
                message: 'Error creating ingredient'
            })
        }
    }

    updateIngredient = async (req: Request, res: Response) => {
        try {
            const ingredientId = req.validatedParams.ingredientId;
            const dataIngredient: UpdateIngredientDTO = req.validatedBody;

            const ingredientUpdated = await this.service.updateIngredient(ingredientId, dataIngredient)

            res.status(200).json(ingredientUpdated)
        } catch (error) {
            if (error.message === 'Ingrediente no encontrado') {
                return res.status(404).json({
                    message: error.message
                })
            }
            if (error.message.startsWith('Ya existe un ingrediente con el nombre')) {
                return res.status(400).json({
                    message: error.message
                })
            }
            res.status(500).json({
                message: 'Error updating ingredient'
            })
        }
    }

    disactivateIngredient = async (req: Request, res: Response) => {
        try {
            const ingredientId = req.validatedParams.ingredientId;
            const result = await this.service.disactivateIngredient(ingredientId)

            res.status(200).json(result)
        } catch (error) {
            if (error.message === 'Ingrediente no encontrado' || error.message === 'El ingrediente ya está inactivo') {
                return res.status(400).json({
                    message: error.message
                })
            }
            res.status(500).json({
                message: 'Error deactivating ingredient'
            })
        }
    }

    activateIngredient = async (req: Request, res: Response) => {
        try {
            const ingredientId = req.validatedParams.ingredientId;
            const result = await this.service.activateIngredient(ingredientId)

            res.status(200).json(result)
        } catch (error) {
            if (error.message === 'Ingrediente no encontrado' || error.message === 'El ingrediente ya está activo') {
                return res.status(400).json({
                    message: error.message
                })
            }
            res.status(500).json({
                message: 'Error activating ingredient'
            })
        }
    }
}
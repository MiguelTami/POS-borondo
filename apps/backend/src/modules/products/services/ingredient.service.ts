import { IngredientsRepository } from "../repositories/ingredient.repository";
import { CreateIngredientDTO, IngredientResponse, UpdateIngredientDTO, DeleteIngredientResponse } from "../types/ingredient.types";

export class IngredientsService { 

    private repository: IngredientsRepository;

    constructor() {
        this.repository = new IngredientsRepository();
    }

    async getActiveIngredients() {
        return await this.repository.getActiveIngredients()
    }

    async getAllIngredients() {
        return await this.repository.getAllIngredients()
    }

    async getIngredientById(id: number) {
        const ingredient = await this.repository.getIngredientById(id)

        if (!ingredient) {
            throw new Error('Ingrediente no encontrado')
        }
        return ingredient
    }

    async createIngredient(data: CreateIngredientDTO): Promise<IngredientResponse> {
        const ingredient = await this.repository.createIngredient(data)
        return ingredient
    }

    async updateIngredient(id: number, data: UpdateIngredientDTO): Promise<IngredientResponse> {
        return await this.repository.updateIngredient(id, data)
    }

    async disactivateIngredient(id: number): Promise<DeleteIngredientResponse> {
        await this.repository.disactivateIngredient(id)
        return {
            message: 'Ingredients deactivated successfully'
        }
    }

    async activateIngredient(id: number): Promise<DeleteIngredientResponse> {
        await this.repository.activateIngredient(id)
        return {
            message: 'Ingredients activated successfully'
        }
    }
}
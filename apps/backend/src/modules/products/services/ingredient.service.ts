import { IngredientsRepository } from "../repositories/ingredient.repository";
import { CreateIngredientDTO, IngredientResponse, UpdateIngredientDTO, DeleteIngredientResponse } from "../types/ingredient.types";

export class IngredientsService { 

    private repository: IngredientsRepository;

    constructor() {
        this.repository = new IngredientsRepository();
    }

    async getIngredients() {
        return await this.repository.getIngredients()
    }

    async getIngredientById(id: number) {
        return await this.repository.getIngredientById(id)
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
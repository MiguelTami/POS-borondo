import { IngredientsRepository } from "../repositories/ingredient.repository";
import { CreateIngredientDTO, IngredientResponse, UpdateIngredientDTO, DeleteIngredientResponse } from "../types/ingredient.types";

export class IngredientsService { 

    private repository: IngredientsRepository;

    constructor() {
        this.repository = new IngredientsRepository();
    }

    async getActiveIngredients() {
        const ingredients = await this.repository.getActiveIngredients()
        if (ingredients.length === 0) {
            throw new Error('No hay ingredientes activos');
        }
        return ingredients
    }

    async getAllIngredients() {
        const ingredients = await this.repository.getAllIngredients()
        if (ingredients.length === 0) {
            throw new Error('No hay ingredientes registrados');
        }
        return ingredients
    }

    async getIngredientById(id: number) {
        const ingredient = await this.repository.getIngredientById(id)

        if (!ingredient) {
            throw new Error('Ingrediente no encontrado')
        }
        return ingredient
    }

    async createIngredient(data: CreateIngredientDTO): Promise<IngredientResponse> {
        const existingIngredient = await this.repository.getIngredientByName(data.name);
        if (existingIngredient) {
            throw new Error(`Ya existe un ingrediente con el nombre: ${data.name}`);
        }
        const ingredient = await this.repository.createIngredient(data)
        return ingredient
    }

    async updateIngredient(id: number, data: UpdateIngredientDTO): Promise<IngredientResponse> {
        await this.getIngredientById(id);

        if (data.name) {
            const existingIngredient = await this.repository.getIngredientByName(data.name);
            if (existingIngredient && existingIngredient.id !== id) {
                throw new Error(`Ya existe un ingrediente con el nombre: ${data.name}`);
            }
        }

        const ingredientUpdated = await this.repository.updateIngredient(id, data);
        return ingredientUpdated;
    }

    async disactivateIngredient(id: number): Promise<DeleteIngredientResponse> {
        const ingredient = await this.getIngredientById(id);
        if (!ingredient.isActive) {
            throw new Error('El ingrediente ya está inactivo');
        }

        await this.repository.disactivateIngredient(id)
        return {
            message: 'Ingrediente desactivado exitosamente'
        }
    }

    async activateIngredient(id: number): Promise<DeleteIngredientResponse> {
        const ingredient = await this.getIngredientById(id);
        if (ingredient.isActive) {
            throw new Error('El ingrediente ya está activo');
        }
        await this.repository.activateIngredient(id)
        return {
            message: 'Ingrediente activado exitosamente'
        }
    }
}
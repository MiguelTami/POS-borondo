import { InventoryRepository } from '../repositories/inventory.repository';
import { IngredientsService } from '../../products/services/ingredient.service';
import { CreateAdjustmentDTO, InventoryMovementQueryDTO } from '../types/inventory.types';

export class InventoryService {

    private repository: InventoryRepository;
    private ingredientsService: IngredientsService;

    constructor() {
        this.repository = new InventoryRepository();
        this.ingredientsService = new IngredientsService();
    }

    async getMovements(query: InventoryMovementQueryDTO) {
        return this.repository.getMovements(query);
    }

    async getStockAlerts() {
        const stock = await this.ingredientsService.getAllIngredients();
        
        const alerts = stock.filter(ingredient => 
            Number(ingredient.stock) <= ingredient.minStockAlert && ingredient.isActive
        );

        if (alerts.length === 0) {
            return { message: 'No hay alertas de stock bajo.' };
        }

        return alerts;
    }

    async createAdjustment(userId: number, data: CreateAdjustmentDTO) {
        const ingredient = await this.ingredientsService.getIngredientById(data.ingredientId);

        if (!ingredient.isActive) {
            throw new Error('No se puede ajustar el stock de un ingrediente inactivo');
        }

        const movement = await this.repository.createAdjustment(userId, data);
        return movement;
    }
}

import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { CreateAdjustmentDTO, InventoryMovementQueryDTO } from '../types/inventory.types';

export class InventoryController {
    
    private service: InventoryService;

    constructor() {
        this.service = new InventoryService();
    }

    getMovements = async (req: Request, res: Response) => {
        try {
            const query: InventoryMovementQueryDTO = req.validatedQuery;
            const movements = await this.service.getMovements(query);

            res.status(200).json(movements);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching inventory movements'
            });
        }
    }

    getStockAlerts = async (req: Request, res: Response) => {
        try {
            const alerts = await this.service.getStockAlerts();
            res.status(200).json(alerts);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching stock alerts'
            });
        }
    }

    createAdjustment = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id;

            const payload: CreateAdjustmentDTO = req.validatedBody;
            const movement = await this.service.createAdjustment(userId, payload);

            res.status(201).json(movement);
        } catch (error) {
            if (error.message === 'Ingrediente no encontrado' || error.message === 'No se puede ajustar el stock de un ingrediente inactivo') {
                return res.status(400).json({
                    message: error.message
                });
            }
            res.status(500).json({
                message: 'Error creating manual adjustment'
            });
        }
    }
}

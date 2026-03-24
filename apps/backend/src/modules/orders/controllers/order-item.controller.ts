import { OrderItemService } from "../services/order-item.service";
import { Request, Response } from "express";
import { CreateItemRequest } from "../types/order-item.types";

export class OrderItemController {

    private service: OrderItemService;

    constructor() {
        this.service = new OrderItemService();
    }

    createOrderItem = async (req: Request, res: Response) => {
        const subOrderId = req.validatedParams.subOrderId;
        const data: CreateItemRequest = req.validatedBody;

        try {
            const orderItem = await this.service.createOrderItem(subOrderId, data);
            
            res.status(201).json(orderItem);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getOrderItems = async (req: Request, res: Response) => {
        const subOrderId = req.validatedParams.subOrderId;

        try {
            const orderItems = await this.service.getOrderItems(subOrderId);
            
            res.status(200).json(orderItems);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }    
    }
}

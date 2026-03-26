import { OrderItemModifierService } from "../services/order-item-modifier.service";
import { Request, Response } from "express";
import { OrderItemModifierResponse, UpdateOrderItemModifier } from "../types/order-item-modifier.types";

export class OrderItemModifierController {

    private service: OrderItemModifierService;

    constructor() {
        this.service = new OrderItemModifierService();
    }

    createOrderItemModifier = async (req: Request, res: Response<OrderItemModifierResponse>) => {
        const orderId= req.validatedParams.orderId;
        const subOrderId = req.validatedParams.subOrderId;
        const orderItemId = req.validatedParams.itemId;
        
        const data = req.validatedBody;

        try {
            const result = await this.service.createOrderItemModifier(orderItemId, orderId, subOrderId, data);

            res.status(201).json(result);
        } catch (error) {
            if (error.message === "Ingrediente no encontrado" || error.message === "Order item no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "No hay suficiente stock del ingrediente para agregar esta modificación") {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "Order item no pertenece a la suborden" || error.message === "SubOrden no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    getOrderItemModifiers = async (req: Request, res: Response<OrderItemModifierResponse[]>) => {
        const orderId= req.validatedParams.orderId;
        const subOrderId = req.validatedParams.subOrderId;
        const orderItemId = req.validatedParams.itemId;

        try {
            const result = await this.service.getOrderItemModifiers(orderItemId, orderId, subOrderId);

            res.json(result);
        } catch (error) {
            if (error.message === "Order item no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Order item no pertenece a la suborden" || error.message === "SubOrden no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    getOrderItemModifierById = async (req: Request, res: Response<OrderItemModifierResponse>) => {
        const orderId= req.validatedParams.orderId;
        const subOrderId = req.validatedParams.subOrderId;
        const orderItemId = req.validatedParams.itemId;
        const modifierId = req.validatedParams.modifierId;

        try {
            const result = await this.service.getOrderItemModifierById(modifierId, orderItemId, orderId, subOrderId);

            res.json(result);
        } catch (error) {
            if (error.message === "Order item modifier no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Order item modifier no pertenece al order item" || error.message === "Order item modifier no pertenece a la suborden" || error.message === "Order item modifier no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    updateOrderItemModifier = async (req: Request, res: Response<OrderItemModifierResponse>) => {
        const orderId= req.validatedParams.orderId;
        const subOrderId = req.validatedParams.subOrderId;
        const orderItemId = req.validatedParams.itemId;
        const modifierId = req.validatedParams.modifierId;

        const data: UpdateOrderItemModifier = req.validatedBody;

        try {
            const result = await this.service.updateOrderItemModifier(modifierId, orderItemId, orderId, subOrderId, data);

            res.json(result);
        } catch (error) {
            if (error.message === "Order item modifier no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Order item modifier no pertenece al order item" || error.message === "Order item modifier no pertenece a la suborden" || error.message === "Order item modifier no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            if (error.message === "No hay suficiente stock del ingrediente para agregar esta modificación") {
                return res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    deleteOrderItemModifier = async (req: Request, res: Response) => {
        const orderId= req.validatedParams.orderId;
        const subOrderId = req.validatedParams.subOrderId;
        const orderItemId = req.validatedParams.itemId;
        const modifierId = req.validatedParams.modifierId;

        try {
            await this.service.deleteOrderItemModifier(modifierId, orderItemId, orderId, subOrderId);
            
            res.status(204).end();
        } catch (error) {
            if (error.message === "Order item modifier no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Order item modifier no pertenece al order item" || error.message === "Order item modifier no pertenece a la suborden" || error.message === "Order item modifier no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

}
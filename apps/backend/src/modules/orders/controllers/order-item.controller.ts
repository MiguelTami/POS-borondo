import { OrderItemService } from "../services/order-item.service";
import { Request, Response } from "express";
import { CreateItemRequest, UpdateItemRequest, ResponseOrderItem } from "../types/order-item.types";

export class OrderItemController {

    private service: OrderItemService;

    constructor() {
        this.service = new OrderItemService();
    }

    createOrderItem = async (req: Request, res: Response) => {
        const subOrderId = req.validatedParams.subOrderId;
        const orderId = req.validatedParams.orderId;
        const data: CreateItemRequest = req.validatedBody;

        try {
            const orderItem = await this.service.createOrderItem(orderId, subOrderId, data);
            
            res.status(201).json(orderItem);
        } catch (error) {
            if (error.message.includes("No hay suficiente stock del ingrediente")) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "Producto no encontrado"||
                error.message === "SubOrden no encontrada" ||
                error.message === "SubOrden no pertenece a la orden"||
                error.message === "No se pueden agregar items a una sub-orden que ya ha sido pagada o enviada al cajero") {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    getOrderItems = async (req: Request, res: Response) => {
        const subOrderId = req.validatedParams.subOrderId;
        const orderId = req.validatedParams.orderId;

        try {
            const orderItems = await this.service.getOrderItems(orderId, subOrderId);
            
            res.status(200).json(orderItems);
        } catch (error) {
            if (error.message === "SubOrden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "SubOrden no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }    
    }

    getOrderItemById = async (req: Request, res: Response) => {
        const id = req.validatedParams.itemId;
        const subOrderId = req.validatedParams.subOrderId;
        const orderId = req.validatedParams.orderId;

        try {
            const orderItem = await this.service.getOrderItemById(id, orderId, subOrderId);

            res.status(200).json(orderItem);
        } catch (error) {
            if (error.message === "Order item no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Order item no pertenece a la suborden") {
                return res.status(403).json({ error: error.message });
            }
            if (error.message === "Order item no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    updateOrderItem = async (req: Request, res: Response) => {
        const id = req.validatedParams.itemId;
        const subOrderId = req.validatedParams.subOrderId;
        const orderId = req.validatedParams.orderId;
        const data: UpdateItemRequest = req.validatedBody;

        try {
            const orderItem = await this.service.updateOrderItem(id, orderId, subOrderId, data);

            res.status(200).json(orderItem);
        } catch (error) {
            if (error.message === "Order item no encontrada" ||
                error.message === "SubOrden no encontrada" ||
                error.message === "SubOrden no pertenece a la orden" ||
                error.message === "No se pueden modificar items a una sub-orden que ya ha sido pagada o enviada al cajero"
            ) {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Order item no pertenece a la suborden") {
                return res.status(403).json({ error: error.message });
            }
            if (error.message === "Order item no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

    deleteOrderItem = async (req: Request, res: Response) => {
        const id = req.validatedParams.itemId;
        const subOrderId = req.validatedParams.subOrderId;
        const orderId = req.validatedParams.orderId;

        try {
            await this.service.deleteOrderItem(id, orderId, subOrderId);
            
            res.status(200).json({ message: "Order item deleted successfully" });
        } catch (error) {
            if (error.message === "Order item no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Order item no pertenece a la suborden") {
                return res.status(403).json({ error: error.message });
            }
            if (error.message === "Order item no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    }

}
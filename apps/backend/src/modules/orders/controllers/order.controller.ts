import { OrderService } from "../services/order.service";
import { Request, Response } from "express";
import { CreateOrderDTO, OrderResponse } from "../types/order.types";

export class OrderController {
    private service: OrderService;

    constructor() {
        this.service = new OrderService();
    }

    createOrder = async (req: Request, res: Response) => {
        try {
            const data: CreateOrderDTO = req.validatedBody;
            const order: OrderResponse = await this.service.createOrder(data);

            res.status(201).json(order);
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Mesa no encontrada" || error.message.includes("rol de mesonero")) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to create order" });
        }
    };

    getOrders = async (req: Request, res: Response) => {
        try {
            const orders = await this.service.getOrders();

            res.status(200).json(orders);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to fetch orders" });
        }
    }

    getOrderById = async (req: Request, res: Response) => {
        try {
            const id = req.validatedParams.orderId;
            const order = await this.service.getOrderById(id);

            res.status(200).json(order);
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to fetch order" });
        }
    }

    updateOrder = async (req: Request, res: Response) => {
        try {
            const id = req.validatedParams.orderId;
            const data = req.validatedBody;
            const updatedOrder: OrderResponse = await this.service.updateOrder(id, data);

            res.status(200).json(updatedOrder);
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to update order" });
        }
    }

    deleteOrder = async (req: Request, res: Response) => {
        try {
            const id = req.validatedParams.orderId;
            await this.service.deleteOrder(id);

            res.status(204).send();
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to delete order" });
        }
    }

    updateOrderStatus = async (req: Request, res: Response) => {
        try {
            const id = req.validatedParams.orderId;
            const status = req.validatedBody.status;
            const updatedOrder = await this.service.updateOrderStatus(id, status);

            res.status(200).json(updatedOrder);
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to update order status" });
        }
    }
}

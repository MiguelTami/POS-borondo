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
            const tableId: number = req.validatedBody.tableId;
            const waiterId: number = req.user!.id;
            const order: OrderResponse = await this.service.createOrder({ tableId, waiterId });

            res.status(201).json(order);
        } catch (error: any) {
            console.error(error.message);
            if (
                error.message === "La mesa no existe" || 
                error.message.includes("rol de mesonero") || 
                error.message === "La mesa no está disponible" ||
                error.message === "No hay un turno activo. Debes abrir un turno antes de crear órdenes."
            ) {
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
            if (error.message === "No se encontraron órdenes") {
                return res.status(404).json({ error: error.message });
            }
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
            const tableId: number = req.validatedBody.tableId;
            const waiterId: number = req.user!.id;
            const updatedOrder: OrderResponse = await this.service.updateOrder(id, { tableId, waiterId });

            res.status(200).json(updatedOrder);
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "La mesa no existe" || error.message.includes("rol de mesonero") || error.message === "La mesa no está disponible") {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to update order" });
        }
    }

    deleteOrder = async (req: Request, res: Response) => {
        try {
            const id = req.validatedParams.orderId;
            await this.service.deleteOrder(id);

            res.status(200).json({ message: "Orden eliminada exitosamente" });
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to delete order" });
        }
    }

    sendOrderToCashier = async (req: Request, res: Response) => {
        try {
            const id = req.validatedParams.orderId;
            const userId = req.user!.id;
            const updatedOrder = await this.service.sendOrderToCashier(id, userId);

            res.status(200).json(updatedOrder);
        } catch (error: any) {
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Solo se pueden enviar al cajero órdenes en estado OPEN") {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to send order to cashier" });
        }
    }

    payOrder = async (req: Request, res: Response) => {
        try {
            const id = req.validatedParams.orderId;
            const updatedOrder = await this.service.payOrder(id);

            res.status(200).json(updatedOrder);
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "No se puede pagar una orden que ya ha sido cancelada, o que no ha sido enviada al cajero" ||
                error.message === "No se puede pagar una orden que tiene subórdenes que no han sido pagadas o canceladas"||
                error.message === "No se puede pagar una orden que ya ha sido pagada"
            ) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to pay order" });
        }
    }

    cancelOrder = async (req: Request, res: Response) => {
        try {
            const id = req.validatedParams.orderId;
            const updatedOrder = await this.service.cancelOrder(id);

            res.status(200).json(updatedOrder);
        } catch (error: any) {
            console.error(error.message);
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "No se puede cancelar una orden que ya ha sido pagada" ||
                error.message === "No se puede cancelar una orden que tiene subórdenes pagadas"
            ) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Failed to cancel order" });
        }
    }
}

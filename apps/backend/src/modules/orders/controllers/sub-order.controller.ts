import { SubOrderService } from "../services/sub-order.service";
import { Request, Response } from "express";

export class SubOrderController {
    private subOrderService: SubOrderService;

    constructor() {
        this.subOrderService = new SubOrderService();
    }

    createSubOrder = async (req: Request, res: Response) => {
        try {
            const { label }: { label: string } = req.validatedBody;
            const subOrder = await this.subOrderService.createSubOrder(req.validatedParams.orderId, label);

            res.status(201).json(subOrder);
        } catch (error) {
            if (error.message === "No se pueden agregar sub-órdenes a una orden que está cancelada o pagada") {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to create sub-order" });
        }
    }

    getSubOrders = async (req: Request, res: Response) => {
        try {
            const subOrders = await this.subOrderService.getSubOrders(req.validatedParams.orderId);

            res.status(200).json(subOrders);
        } catch (error) {
            if (error.message === "No se encontraron sub-órdenes para esta orden") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Orden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to retrieve sub-orders" });
        }
    }

    getSubOrderById = async (req: Request, res: Response) => {
        try {
            const subOrder = await this.subOrderService.getSubOrderById(req.validatedParams.orderId, req.validatedParams.subOrderId);

            res.status(200).json(subOrder);
        } catch (error) {
            console.error(error.message);
            if (error.message === "SubOrden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "SubOrden no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to retrieve sub-order" });
        }
    }

    updateSubOrder = async (req: Request, res: Response) => {
        try {
            const { label }: { label: string } = req.validatedBody;
            const subOrder = await this.subOrderService.updateSubOrder(req.validatedParams.orderId, req.validatedParams.subOrderId, label); 

            res.status(200).json(subOrder);
        } catch (error) {
            if (error.message === "No se puede actualizar una sub-orden que ya ha sido pagada, enviada al cajero o cancelada") {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "SubOrden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "SubOrden no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to update sub-order" });
        }
    }

    deleteSubOrder = async (req: Request, res: Response) => {
        try {
            await this.subOrderService.deleteSubOrder(req.validatedParams.orderId, req.validatedParams.subOrderId);

            res.status(200).json({ message: "La sub-orden fue eliminada exitosamente" });
        } catch (error) {
            if (error.message === "No se puede eliminar una sub-orden que ya ha sido pagada o enviada al cajero") {
                return res.status(400).json({ error: error.message });
             }
            if (error.message === "SubOrden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "SubOrden no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to delete sub-order" });
        }
    }

    sendSubOrderToCashier = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id;
            const subOrder = await this.subOrderService.sendSubOrderToCashier(req.validatedParams.orderId, req.validatedParams.subOrderId, userId);

            res.status(200).json(subOrder);
        } catch (error) {
            console.error(error.message);
            if (error.message === "No se puede enviar una sub-orden que ya ha sido cancelada o pagada" || 
                error.message === "La sub-orden ya ha sido enviada al cajero" ||
                error.message === "No se puede enviar al cajero una sub-orden sin productos"
            ) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "SubOrden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "SubOrden no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to send sub-order to cashier" });
        }
    }

    cancelSubOrder = async (req: Request, res: Response) => {
        try {
            const subOrder = await this.subOrderService.cancelSubOrder(req.validatedParams.orderId, req.validatedParams.subOrderId);

            res.status(200).json(subOrder);
        } catch (error) {
            if (error.message === "No se puede cancelar una sub-orden que ya ha sido pagada") {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "SubOrden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "SubOrden no pertenece a la orden") {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to cancel sub-order" });
        }
    }
}
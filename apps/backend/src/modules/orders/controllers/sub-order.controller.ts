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
            console.error(error.message);
            res.status(500).json({ error: "Failed to create sub-order" });
        }
    }

    getSubOrders = async (req: Request, res: Response) => {
        try {
            const subOrders = await this.subOrderService.getSubOrders(req.validatedParams.orderId);

            res.status(200).json(subOrders);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to retrieve sub-orders" });
        }
    }

    getSubOrderById = async (req: Request, res: Response) => {
        try {
            const subOrder = await this.subOrderService.getSubOrderById(req.validatedParams.orderId, req.validatedParams.subOrderId);

            res.status(200).json(subOrder);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to retrieve sub-order" });
        }
    }

    updateSubOrder = async (req: Request, res: Response) => {
        try {
            const { label }: { label: string } = req.validatedBody;
            const subOrder = await this.subOrderService.updateSubOrder(req.validatedParams.orderId, req.validatedParams.subOrderId, label); 

            res.status(200).json(subOrder);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to update sub-order" });
        }
    }

    deleteSubOrder = async (req: Request, res: Response) => {
        try {
            await this.subOrderService.deleteSubOrder(req.validatedParams.orderId, req.validatedParams.subOrderId);

            res.status(200).json({ message: "Sub-order deleted successfully" });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to delete sub-order" });
        }
    }

    sendSubOrderToCashier = async (req: Request, res: Response) => {
        try {
            const subOrder = await this.subOrderService.sendSubOrderToCashier(req.validatedParams.orderId, req.validatedParams.subOrderId);

            res.status(200).json(subOrder);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to send sub-order to cashier" });
        }
    }

    paySubOrder = async (req: Request, res: Response) => {
        try {
            const subOrder = await this.subOrderService.paySubOrder(req.validatedParams.orderId, req.validatedParams.subOrderId);

            res.status(200).json(subOrder);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to pay sub-order" });
        }
    }

    cancelSubOrder = async (req: Request, res: Response) => {
        try {
            const subOrder = await this.subOrderService.cancelSubOrder(req.validatedParams.orderId, req.validatedParams.subOrderId);

            res.status(200).json(subOrder);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to cancel sub-order" });
        }
    }
}
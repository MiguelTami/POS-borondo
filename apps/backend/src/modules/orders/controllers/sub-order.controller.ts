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
}
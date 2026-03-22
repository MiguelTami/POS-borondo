import { OrderService } from "../services/order.service";
import { Request, Response } from "express";
import { CreateOrderDTO } from "../types/order.types";

export class OrderController {
  private service: OrderService;

  constructor() {
    this.service = new OrderService();
  }

  createOrder = async (req: Request, res: Response) => {
    try {
      const data: CreateOrderDTO = (req as any).validatedBody || req.body;
      const order = await this.service.createOrder(data);
      res.status(201).json(order);
    } catch (error: any) {
      console.error(error.message);
      if (error.message === "Mesa no encontrada" || error.message.includes("rol de mesonero")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  };
}

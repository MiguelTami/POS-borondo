import { OrderService } from "../services/order.service";
import { Request, Response } from "express";
import { CreateOrderDTO } from "../types/order.types";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const { tableId, waiterId } = req.body as CreateOrderDTO;

      if (!tableId || !waiterId) {
        return res
          .status(400)
          .json({ error: "Faltan campos requeridos: tableId y waiterId" });
      }

      const newOrder = await this.orderService.createOrder({
        tableId,
        waiterId,
      });

      return res.status(201).json({
        message: "Orden creada exitosamente",
        data: newOrder,
      });
    } catch (error: any) {
      console.error("[OrderController.create] Error:", error);

      // Handle specific domain errors (not ideal string matching but works for this scope)
      if (
        error.message === "Mesa no encontrada" ||
        error.message.includes("rol de mesonero")
      ) {
        return res.status(400).json({ error: error.message });
      }

      return res
        .status(500)
        .json({ error: "Error interno del servidor al crear la orden" });
    }
  };
}

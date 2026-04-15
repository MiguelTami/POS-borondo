import { Request, Response } from "express";
import { StatisticsService } from "../services/statistics.service";

export class StatisticsController {
  private service: StatisticsService;

  constructor() {
    this.service = new StatisticsService();
  }

  async getSummary(req: Request, res: Response) {
    try {
      const data = await this.service.getSummary(req.query);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getShiftOrders(req: Request, res: Response) {
    try {
      const { shiftId } = req.params;
      const data = await this.service.getShiftOrders(Number(shiftId));
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTopProducts(req: Request, res: Response) {
    try {
      const data = await this.service.getTopProducts(req.query);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTopIngredients(req: Request, res: Response) {
    try {
      const data = await this.service.getTopIngredients(req.query);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

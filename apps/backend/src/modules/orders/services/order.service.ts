import { OrderRepository } from "../repositories/order.repository";
import { prisma } from "../../../config/prisma";
import { CreateOrderDTO } from "../types/order.types";

export class OrderService {
  private repository: OrderRepository;

  constructor() {
    this.repository = new OrderRepository();
  }

  async createOrder(data: CreateOrderDTO) {
    const [table, waiter] = await Promise.all([
      prisma.table.findUnique({ where: { id: data.tableId } }),
      prisma.user.findUnique({ where: { id: data.waiterId } }),
    ]);

    if (!table) {
      throw new Error("Mesa no encontrada");
    }

    if (!waiter || waiter.role !== "WAITER") {
      throw new Error("El usuario no existe o no tiene rol de mesonero");
    }

    const now = new Date();
    const businessDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    return this.repository.createOrder(data, businessDate);
  }
}

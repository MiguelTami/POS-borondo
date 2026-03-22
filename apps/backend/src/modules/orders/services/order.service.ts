import { OrderRepository } from "../repositories/order.repository";
import { prisma } from "../../../config/prisma";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(data: { tableId: number; waiterId: number }) {
    // 1. Validaciones
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

    // Calcular el inicio del día del negocio actual (ignorando la hora local)
    // Esto se puede ajustar dependiendo de la zona horaria del restaurante
    const now = new Date();
    const businessDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    // 2. Creación con la transacción que maneja concurrencia y contadores
    const order = await this.orderRepository.createOrder({
      tableId: data.tableId,
      waiterId: data.waiterId,
      businessDate,
    });

    return order;
  }
}

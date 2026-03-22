import { prisma } from "../../../config/prisma";
import { CreateOrderDTO } from "../types/order.types";

export class OrderRepository {

  async createOrder(data: CreateOrderDTO, businessDate: Date) {
    return prisma.$transaction(async (tx) => {
      const counter = await tx.dailyOrderCounter.upsert({
        where: { businessDate },
        update: { lastOrderNumber: { increment: 1 } },
        create: { businessDate, lastOrderNumber: 1 },
      });

      return tx.order.create({
        data: {
          tableId: data.tableId,
          waiterId: data.waiterId,
          businessDate,
          dailyOrderNumber: counter.lastOrderNumber
        },
        include: {
          table: true,
          waiter: {
            select: { id: true, name: true, role: true },
          },
        },
      });
    });
  }
}

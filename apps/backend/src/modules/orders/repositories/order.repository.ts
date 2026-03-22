import { prisma } from "../../../config/prisma";

export class OrderRepository {
  async createOrder(data: {
    tableId: number;
    waiterId: number;
    businessDate: Date;
  }) {
    // Usamos una transacción interactiva de Prisma para garantizar atomicidad y evitar colisiones
    return await prisma.$transaction(async (tx) => {
      // 1. Incrementamos o creamos el contador atómicamente
      const counter = await tx.dailyOrderCounter.upsert({
        where: { businessDate: data.businessDate },
        update: { lastOrderNumber: { increment: 1 } },
        create: { businessDate: data.businessDate, lastOrderNumber: 1 },
      });

      // 2. Creamos la orden con el número obtenido
      const order = await tx.order.create({
        data: {
          tableId: data.tableId,
          waiterId: data.waiterId,
          businessDate: data.businessDate,
          dailyOrderNumber: counter.lastOrderNumber,
          status: "OPEN",
        },
        include: {
          table: true,
          waiter: {
            select: { id: true, name: true, role: true },
          },
        },
      });

      return order;
    });
  }
}

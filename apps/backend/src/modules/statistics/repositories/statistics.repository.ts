import { prisma } from "../../../config/prisma";

export class StatisticsRepository {
  async getPaymentsByDateRange(start: Date, end: Date) {
    return prisma.payment.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async countOrdersByDateRange(start: Date, end: Date) {
    return prisma.order.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async getShiftsByDateRange(start: Date, end: Date) {
    return prisma.shift.findMany({
      where: {
        openedAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        openedAt: true,
        closedAt: true,
        difference: true,
        expectedRevenue: true,
      },
    });
  }

  async getShiftWithOrders(shiftId: number) {
    return prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        orders: {
          include: {
            subOrders: {
              include: {
                orderItems: {
                  include: {
                    product: true,
                    modifiers: {
                      include: { ingredient: true },
                    },
                  },
                },
                payments: true,
              },
            },
            waiter: true,
            table: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async getTopProductsByOrderItems(start: Date, end: Date, limit: number) {
    return prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
        totalPriceSnapshot: true,
      },
      where: {
        subOrder: {
          order: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        },
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });
  }

  async getProductsByIds(productIds: number[]) {
    return prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });
  }

  async getTopIngredientsByMovements(start: Date, end: Date, limit: number) {
    return prisma.inventoryMovement.groupBy({
      by: ["ingredientId"],
      _sum: {
        quantity: true,
      },
      where: {
        type: "SALE_DEDUCTION",
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });
  }

  async getIngredientsByIds(ingredientIds: number[]) {
    return prisma.ingredient.findMany({
      where: { id: { in: ingredientIds } },
    });
  }
}

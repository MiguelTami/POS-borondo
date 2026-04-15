import {
  startOfDay,
  endOfDay,
  parseISO,
  differenceInDays,
  format,
} from "date-fns";
import { StatisticsRepository } from "../repositories/statistics.repository";
import { DateRangeQueryDTO } from "../types/statistics.types";

export class StatisticsService {
  private repository: StatisticsRepository;

  constructor() {
    this.repository = new StatisticsRepository();
  }

  // Helper to parse dates
  private parseDates(startDate?: string, endDate?: string) {
    const start = startDate
      ? startOfDay(parseISO(startDate))
      : startOfDay(new Date());
    const end = endDate ? endOfDay(parseISO(endDate)) : endOfDay(new Date());
    return { start, end };
  }

  async getSummary(query: DateRangeQueryDTO) {
    const { start, end } = this.parseDates(query.startDate, query.endDate);

    // Get total orders and revenue
    const payments = await this.repository.getPaymentsByDateRange(start, end);

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    // Orders count
    const ordersCount = await this.repository.countOrdersByDateRange(
      start,
      end,
    );

    // Revenue by payment method
    const revenueByMethod = payments.reduce(
      (acc, payment) => {
        acc[payment.method] =
          (acc[payment.method] || 0) + Number(payment.amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    // Revenue over time (timeline)
    const sortedPayments = [...payments].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    const diffDays = differenceInDays(end, start);
    let dateFormatStr = "yyyy-MM-dd";
    if (diffDays <= 1) {
      dateFormatStr = "HH:00"; // Hour
    } else if (diffDays <= 31) {
      dateFormatStr = "MMM dd"; // Day
    } else {
      dateFormatStr = "yyyy-MM"; // Month
    }

    const revenueMap = new Map<string, number>();
    sortedPayments.forEach((payment) => {
      const key = format(payment.createdAt, dateFormatStr);
      revenueMap.set(key, (revenueMap.get(key) || 0) + Number(payment.amount));
    });

    const revenueOverTime = Array.from(revenueMap.entries()).map(
      ([date, amount]) => ({ date, amount }),
    );

    // Active shifts in the period
    const shiftsInfo = await this.repository.getShiftsByDateRange(start, end);

    return {
      totalRevenue,
      ordersCount,
      revenueByMethod,
      revenueOverTime,
      shiftsCount: shiftsInfo.length,
      averageOrderValue: ordersCount ? totalRevenue / ordersCount : 0,
    };
  }

  async getShiftOrders(shiftId: number) {
    const shift = await this.repository.getShiftWithOrders(shiftId);

    if (!shift) {
      throw new Error("Turno no encontrado");
    }

    // Format the output
    const orders = shift.orders.map((order) => {
      let total = 0;
      let payments: any[] = [];
      let items: any[] = [];
      const mappedSubOrders: any[] = [];

      order.subOrders.forEach((sub) => {
        const subTotal = sub.orderItems.reduce(
          (sum, item) => sum + Number(item.totalPriceSnapshot),
          0,
        );
        total += subTotal;
        const subPayments = sub.payments;
        sub.payments.forEach((p) => payments.push(p));

        const subItems: any[] = [];
        sub.orderItems.forEach((item) => {
          const mappedItem = {
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: Number(item.unitPriceSnapshot),
            totalPrice: Number(item.totalPriceSnapshot),
            notes: item.notes,
            modifiers: item.modifiers.map(
              (m) => `${m.type} ${m.ingredient.name}`,
            ),
          };
          items.push(mappedItem);
          subItems.push(mappedItem);
        });

        mappedSubOrders.push({
          id: sub.id,
          label: sub.label,
          status: sub.status,
          total: subTotal,
          items: subItems,
          payments: subPayments,
          createdAt: sub.createdAt,
        });
      });

      return {
        id: order.id,
        dailyOrderNumber: order.dailyOrderNumber,
        status: order.status,
        createdAt: order.createdAt,
        waiter: order.waiter.name,
        table: order.table.number,
        total,
        payments,
        items,
        subOrders: mappedSubOrders,
      };
    });

    return {
      shiftId: shift.id,
      openedAt: shift.openedAt,
      closedAt: shift.closedAt,
      orders,
    };
  }

  async getTopProducts(query: DateRangeQueryDTO) {
    const { start, end } = this.parseDates(query.startDate, query.endDate);
    const limit = Number(query.limit) || 10;

    const items = await this.repository.getTopProductsByOrderItems(
      start,
      end,
      limit,
    );

    // Get product details
    const products = await this.repository.getProductsByIds(
      items.map((i) => i.productId),
    );

    return items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: product?.id,
        name: product?.name || "Desconocido",
        category: product?.category?.name || "Sin categoría",
        quantitySold: Number(item._sum.quantity || 0),
        revenue: Number(item._sum.totalPriceSnapshot || 0),
      };
    });
  }

  async getTopIngredients(query: DateRangeQueryDTO) {
    const { start, end } = this.parseDates(query.startDate, query.endDate);
    const limit = Number(query.limit) || 10;

    // Fetch Inventory DEDUCTIONS (Sales) to infer ingredient usage!
    const movements = await this.repository.getTopIngredientsByMovements(
      start,
      end,
      limit,
    );

    const ingredients = await this.repository.getIngredientsByIds(
      movements.map((m) => m.ingredientId),
    );

    return movements.map((m) => {
      const ingredient = ingredients.find((i) => i.id === m.ingredientId);
      return {
        id: ingredient?.id,
        name: ingredient?.name || "Desconocido",
        unit: ingredient?.unit || "",
        quantityUsed: Number(m._sum.quantity || 0),
      };
    });
  }
}

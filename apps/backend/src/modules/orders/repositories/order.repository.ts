import { prisma } from "../../../config/prisma";
import { CreateOrderDTO, UpdateOrderDTO, updateStatusDTO } from "../types/order.types";

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
             select: {
                id: true,
                dailyOrderNumber: true,
                businessDate: true,
                status: true,
                table: {
                    select: {
                        number: true,
                        status: true
                    }
                },
                waiter: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        });
    }

    async getOrders() {
        return prisma.order.findMany({
            include: {
                table: true,
                waiter: {
                    select: { id: true, name: true, role: true },
                },
            },
        });
    }

    async getOrderById(id: number) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                table: true,
                waiter: {
                    select: { id: true, name: true, role: true },
                },
            },
        });
    }

    async updateOrder(id: number, data: UpdateOrderDTO) {
        return prisma.order.update({
            where: { id },
            data,
            include: {
                table: true,
                waiter: {
                    select: { id: true, name: true, role: true },
                },
            },
        });
    }

    async deleteOrder(id: number) {
        return prisma.order.delete({
            where: { id },
        });
    }

    async updateOrderStatus(id: number, status: updateStatusDTO["status"]) {
        return prisma.order.update({
            where: { id },
            data: { status },
            include: {
                table: true,
                waiter: {
                    select: { id: true, name: true, role: true },
                },
            },
        });
    }

}

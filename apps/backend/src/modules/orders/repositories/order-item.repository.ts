import { prisma } from "../../../config/prisma";
import { CreateOrderItemDTO, UpdateOrderItemDTO } from "../types/order-item.types";

export class OrderItemRepository {

    async createOrderItem(subOrderId: number, data: CreateOrderItemDTO) {
        return prisma.orderItem.create({
            data: {
                subOrderId,
                productId: data.productId,
                quantity: data.quantity,
                notes: data.notes,
                unitPriceSnapshot: data.unitPrice,
                totalPriceSnapshot: data.totalPrice
            },
            include: {
                product: true,
                subOrder: true
            }
        });
    }

    async getOrderItems(subOrderId: number) {
        return prisma.orderItem.findMany({
            where: { subOrderId },
            include: {
                product: true,
                subOrder: true
            }
        });
    }

    async getOrderItemById(id: number) {
        return prisma.orderItem.findUnique({
            where: { id },
            include: {
                product: true,
                subOrder: true
            }
        });
    }

    async updateOrderItem(id: number, data: UpdateOrderItemDTO) {
        return prisma.orderItem.update({
            where: { id },
            data,
            include: {
                product: true,
                subOrder: true
            }
        });
    }

    async deleteOrderItem(id: number) {
        return prisma.orderItem.delete({
            where: { id }
        });
    }
}
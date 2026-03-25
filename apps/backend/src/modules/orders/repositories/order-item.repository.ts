import { prisma } from "../../../config/prisma";
import { CreateOrderItemDTO, UpdateOrderItemDTO, ResponseOrderItem } from "../types/order-item.types";

export class OrderItemRepository {

    async createOrderItem(subOrderId: number, data: CreateOrderItemDTO): Promise<ResponseOrderItem> {
        const orderItem = await prisma.orderItem.create({
            data: {
                subOrderId,
                productId: data.productId,
                quantity: data.quantity,
                notes: data.notes,
                unitPriceSnapshot: data.unitPrice,
                totalPriceSnapshot: data.totalPrice
            },
            select: {
                id: true,
                quantity: true,
                notes: true,
                unitPriceSnapshot: true,
                totalPriceSnapshot: true,
                subOrderId: true,
                productId: true,
                product: { select: { name: true } },
                subOrder: { select: { label: true, status: true, orderId: true } }
            }
        });

        return {
            ...orderItem,
            unitPriceSnapshot: orderItem.unitPriceSnapshot.toNumber(),
            totalPriceSnapshot: orderItem.totalPriceSnapshot.toNumber()
        }
    }

    async getOrderItems(subOrderId: number): Promise<ResponseOrderItem[]> {
        const orderItems = await prisma.orderItem.findMany({
            where: { subOrderId },
            select: {
                id: true,
                quantity: true,
                notes: true,
                unitPriceSnapshot: true,
                totalPriceSnapshot: true,
                subOrderId: true,
                productId: true,
                product: { select: { name: true } },
                subOrder: { select: { label: true, status: true, orderId: true } }
            }
        });
        

        return orderItems.map(item => ({
            ...item,
            unitPriceSnapshot: item.unitPriceSnapshot.toNumber(),
            totalPriceSnapshot: item.totalPriceSnapshot.toNumber()
        }));
    }

    async getOrderItemById(id: number): Promise<ResponseOrderItem> {
        const orderItem = await prisma.orderItem.findUnique({
            where: { id },
            select: {
                id: true,
                quantity: true,
                notes: true,
                unitPriceSnapshot: true,
                totalPriceSnapshot: true,
                subOrderId: true,
                productId: true,
                product: { select: { name: true } },
                subOrder: { select: { label: true, status: true, orderId: true } }
            }
        });

        if (!orderItem) {
            return null;
        }

        return {
            ...orderItem,
            unitPriceSnapshot: orderItem.unitPriceSnapshot.toNumber(),
            totalPriceSnapshot: orderItem.totalPriceSnapshot.toNumber()
        }
    }

    async updateOrderItem(id: number, data: UpdateOrderItemDTO): Promise<ResponseOrderItem> {
        const orderItem = await prisma.orderItem.update({
            where: { id },
            data,
            select: {
                id: true,
                quantity: true,
                notes: true,
                unitPriceSnapshot: true,
                totalPriceSnapshot: true,
                subOrderId: true,
                productId: true,
                product: { select: { name: true } },
                subOrder: { select: { label: true, status: true, orderId: true } }
            }
        });

        return {
            ...orderItem,
            unitPriceSnapshot: orderItem.unitPriceSnapshot.toNumber(),
            totalPriceSnapshot: orderItem.totalPriceSnapshot.toNumber()
        }
    }

    async deleteOrderItem(id: number) {
        return prisma.orderItem.delete({
            where: { id }
        });
    }
}
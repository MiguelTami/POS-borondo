import { prisma } from '../../../config/prisma';

export class SubOrderRepository {
    
    async createSubOrder(orderId: number, label: string) {
        return prisma.subOrder.create({
            data: {
                orderId,
                label
            },
            select: {
                id: true,
                label: true,
                status: true,
                order: {
                    select: {
                        dailyOrderNumber: true,
                        businessDate: true,
                        table: {
                            select: {
                                number: true
                            }
                        },
                        waiter: {
                            select: {
                                name: true
                            }
                        }

                    }
                }

            }

        });
    }

    async getSubOrders(orderId: number) {
        return prisma.subOrder.findMany({
            where: {
                orderId
            },
            include: {
                order: true,
                orderItems: true
            }
        });
    }

    async getSubOrderById(orderId: number, subOrderId: number) {
        return prisma.subOrder.findUnique({
            where: {
                id: subOrderId,
                orderId
            },
            include: {
                order: true,
                orderItems: true
            }
        });
    }

    async updateSubOrder(orderId: number, subOrderId: number, label: string) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
                orderId
            },
            data: {
                label
            }
        });
    }

    async deleteSubOrder(orderId: number, subOrderId: number) {
        return prisma.subOrder.delete({
            where: {
                id: subOrderId,
                orderId
            }
        });
    }

    async sendSubOrderToCashier(orderId: number, subOrderId: number) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
                orderId
            },
            data: {
                status: 'SENT_TO_CASHIER'
            }
        });
    }

    async paySubOrder(orderId: number, subOrderId: number) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
                orderId
            },
            data: {
                status: 'PAID'
            }
        });
    }

    async cancelSubOrder(orderId: number, subOrderId: number) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
                orderId
            },
            data: {
                status: 'CANCELLED'
            }
        });
    }
}
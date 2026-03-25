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

    async getSubOrderById(subOrderId: number) {
        return prisma.subOrder.findUnique({
            where: {
                id: subOrderId
            },
            include: {
                order: true,
                orderItems: true
            }
        });
    }

    async updateSubOrder(subOrderId: number, label: string) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
            },
            data: {
                label
            }
        });
    }

    async deleteSubOrder(subOrderId: number) {
        return prisma.subOrder.delete({
            where: {
                id: subOrderId,
            }
        });
    }

    async sendSubOrderToCashier(subOrderId: number) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
            },
            data: {
                status: 'SENT_TO_CASHIER'
            }
        });
    }

    async paySubOrder(subOrderId: number) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
            },
            data: {
                status: 'PAID'
            }
        });
    }

    async cancelSubOrder(subOrderId: number) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
            },
            data: {
                status: 'CANCELLED'
            }
        });
    }
}
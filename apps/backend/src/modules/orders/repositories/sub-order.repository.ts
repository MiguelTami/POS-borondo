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
}
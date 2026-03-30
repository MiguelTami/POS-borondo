import { prisma } from "../../../config/prisma";
import { CreateOrderDTO, UpdateOrderDTO } from "../types/order.types";

export class OrderRepository {

    async createOrder(data: CreateOrderDTO, businessDate: Date) {
        return prisma.$transaction(async (tx) => {
        await tx.table.update({
            where: { id: data.tableId },
            data: { status: "OCCUPIED" }
        });

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
                status: true,
                tableId: true,
                table: {
                    select: {
                        number: true,
                        status: true
                    }
                },
                waiterId: true,
                waiter: {
                    select: {
                        name: true
                    }
                }
            }
        });
        });
    }

    async getOrders() {
        return prisma.order.findMany({
            select: {
                id: true,
                dailyOrderNumber: true,
                status: true,
                tableId: true,
                table: {
                    select: {
                        number: true,
                        status: true
                    }
                },
                waiterId: true,
                waiter: {
                    select: {
                        name: true
                    }
                },
                subOrders: {
                    select: {
                        id: true,
                        label: true,
                        status: true,
                    }
                }
            }
        });
    }

    async getOrderById(id: number) {
        return prisma.order.findUnique({
            where: { id },
            select: {
                id: true,
                dailyOrderNumber: true,
                status: true,
                tableId: true,
                table: {
                    select: {
                        number: true,
                        status: true
                    }
                },
                waiterId: true,
                waiter: {
                    select: {
                        name: true
                    }
                },
                subOrders: {
                    select: {
                        id: true,
                        label: true,
                        status: true,
                    }
                }
            },
        });
    }

    async updateOrder(id: number, data: UpdateOrderDTO) {
        return prisma.order.update({
            where: { id },
            data,
            select: {
                id: true,
                dailyOrderNumber: true,
                status: true,
                tableId: true,
                table: {
                    select: {
                        number: true,
                        status: true
                    }
                },
                waiterId: true,
                waiter: {
                    select: {
                        name: true
                    }
                },
                subOrders: {
                    select: {
                        id: true,
                        label: true,
                        status: true,
                    }
                }
            }
        });
    }

    async deleteOrder(id: number) {
        return prisma.order.delete({
            where: { id },
        });
    }

    async sendOrderToCashier(id: number) {
        return prisma.$transaction(async (tx) => {
            await tx.subOrder.updateMany({
                where: { 
                    orderId: id,
                    status: "OPEN"
                },
                data: { status: "SENT_TO_CASHIER" }
            }); 
            return tx.order.update({
                where: { id },
                data: { status: "SENT_TO_CASHIER" },
                select: {
                    id: true,
                    dailyOrderNumber: true,
                    status: true,
                    tableId: true,
                    table: {
                        select: {
                            number: true,
                            status: true
                        }
                    },
                    waiterId: true,
                    waiter: {
                        select: {
                            name: true
                        }
                    },
                    subOrders: {
                        select: {
                            id: true,
                            label: true,
                            status: true,
                        }
                    }
                }
            });
        })
    }

    async payOrder(id: number) {
        return prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id },
                include: {
                    subOrders: {select: { status: true }}
                }
            })

            const hasUnpaidSubOrders = order.subOrders.some(subOrder => subOrder.status !== "PAID" && subOrder.status !== "CANCELLED");

            if (hasUnpaidSubOrders) {
                throw new Error("No se puede pagar una orden que tiene subórdenes que no han sido pagadas o canceladas");
            }

            await tx.table.update({
                where: { id: order.tableId },
                data: { status: "AVAILABLE" }
            });

            return tx.order.update({
                where: { id },
                data: { status: "PAID" },
                select: {
                    id: true,
                    dailyOrderNumber: true,
                    status: true,
                    tableId: true,
                    table: {
                        select: {
                            number: true,
                            status: true
                        }
                    },
                    waiterId: true,
                    waiter: {
                        select: {
                            name: true
                        }
                    },
                    subOrders: {
                        select: {
                            id: true,
                            label: true,
                            status: true,
                        }
                    }
                }
            });
        })
    }

    async cancelOrder(id: number) {
        return prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id },
                select: { tableId: true }
            })

            if (order) {
                await tx.table.update({
                    where: { id: order.tableId },
                    data: { status: "AVAILABLE" }
                });
            } 
            await tx.subOrder.updateMany({
                where: { 
                    orderId: id,
                    status: { not: "PAID" }
                },
                data: { status: "CANCELLED" }
            });       
            return tx.order.update({
                where: { id },
                data: { status: "CANCELLED" },
                select: {
                    id: true,
                    dailyOrderNumber: true,
                    status: true,
                    tableId: true,
                    table: {
                        select: {
                            number: true,
                            status: true
                        }
                    },
                    waiterId: true,
                    waiter: {
                        select: {
                            name: true
                        }
                    },
                    subOrders: {
                        select: {
                            id: true,
                            label: true,
                            status: true,
                        }
                    }
                }
            });
        })
    }
}
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
            shiftId: data.shiftId!,
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
                shiftId: true,
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
                        orderItems: {
                            select: {
                                id: true,
                                quantity: true,
                                notes: true,
                                totalPriceSnapshot: true,
                                product: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
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
                shiftId: true,
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
                        orderItems: {
                            select: {
                                id: true,
                                quantity: true,
                                notes: true,
                                totalPriceSnapshot: true,
                                product: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
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
                shiftId: true,
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

    async getOrderWithModifiersAndRecipes(orderId: number) {
        return prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                subOrders: {
                    where: { status: 'OPEN' },
                    select: {
                        id: true,
                        orderItems: {
                            select: {
                                id: true,
                                quantity: true,
                                notes: true,
                                product: {
                                    select: {
                                        recipes: {
                                            select: {
                                                ingredientId: true,
                                                quantityRequired: true
                                            }
                                        }
                                    }
                                },
                                modifiers: {
                                    select: {
                                        ingredientId: true,
                                        type: true,
                                        quantity: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async sendOrderToCashier(id: number, userId: number, deductions: { ingredientId: number, quantityToDeduct: number, subOrderId: number }[]) {
        return prisma.$transaction(async (tx) => {
            const groupedMap = deductions.reduce((acc, curr) => {
                const key = `${curr.ingredientId}-${curr.subOrderId}`;
                if (acc[key]) {
                    acc[key].quantityToDeduct += curr.quantityToDeduct;
                } else {
                    acc[key] = {
                        ingredientId: curr.ingredientId,
                        subOrderId: curr.subOrderId,
                        quantityToDeduct: curr.quantityToDeduct
                    };
                }
                return acc;
            }, {} as Record<string, { ingredientId: number, subOrderId: number, quantityToDeduct: number }>);

            for (const key of Object.keys(groupedMap)) {
                const deduction = groupedMap[key];
                
                await tx.ingredient.update({
                    where: { id: deduction.ingredientId },
                    data: { stock: { decrement: deduction.quantityToDeduct } }
                });

                await tx.inventoryMovement.create({
                    data: {
                        type: 'SALE_DEDUCTION',
                        quantity: deduction.quantityToDeduct,
                        ingredientId: deduction.ingredientId,
                        subOrderId: deduction.subOrderId,
                        userId: userId
                    }
                });
            }

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
                    shiftId: true,
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

            if (!order) {
                throw new Error(`Order with ID ${id} not found.`);
            }

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
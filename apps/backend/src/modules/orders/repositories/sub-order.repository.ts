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
                        id: true,
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
            select: {
                id: true,
                label: true,
                status: true,
                order: {
                    select: {
                        id: true,
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
                },
                orderItems: {
                    select: {
                        id: true,
                        quantity: true,
                        notes: true,
                        totalPriceSnapshot: true,
                        productId: true,
                        product: { select: { name: true } }
                    }
                }
            }
        });
    }

    async getSubOrderById(subOrderId: number) {
        return prisma.subOrder.findUnique({
            where: {
                id: subOrderId
            },
            select: {
                id: true,
                label: true,
                status: true,
                order: {
                    select: {
                        id: true,
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
                },
                orderItems: {
                    select: {
                        id: true,
                        quantity: true,
                        notes: true,
                        totalPriceSnapshot: true,
                        productId: true,
                        product: { select: { name: true } }
                    }
                }
            }
        });
    }

    async getSubOrderWithModifiersAndRecipes(subOrderId: number) {
        return prisma.subOrder.findUnique({
            where: { id: subOrderId },
            select: {
                id: true,
                orderItems: {
                    select: {
                        id: true,
                        quantity: true,
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
        });
    }

    async updateSubOrder(subOrderId: number, label: string) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
            },
            data: {
                label
            },
            select: {
                id: true,
                label: true,
                status: true,
                order: {
                    select: {
                        id: true,
                        dailyOrderNumber: true,
                        businessDate: true,
                        table: {
                            select: {
                                number: true
                            }
                        },
                    }
                }
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

    async sendSubOrderToCashier(subOrderId: number, userId: number, deductions: { ingredientId: number, quantityToDeduct: number }[]) {
        return prisma.$transaction(async (tx) => {
            const subOrder = await tx.subOrder.update({
                where: {
                    id: subOrderId,
                },
                data: {
                    status: 'SENT_TO_CASHIER'
                },
                select: {
                    id: true,
                    label: true,
                    status: true,
                    order: {
                        select: {
                            id: true,
                            dailyOrderNumber: true,
                            businessDate: true,
                            table: { select: { number: true } },
                            waiter: { select: { name: true } }
                        }
                    },
                    orderItems: {
                        select: {
                            id: true,
                            quantity: true,
                            notes: true,
                            totalPriceSnapshot: true,
                            productId: true,
                            product: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            // Group deductions to avoid hitting same ingredient multiple times in a transaction
            const groupedDeductions = deductions.reduce((acc, curr) => {
                if (acc[curr.ingredientId]) {
                    acc[curr.ingredientId] += curr.quantityToDeduct;
                } else {
                    acc[curr.ingredientId] = curr.quantityToDeduct;
                }
                return acc;
            }, {} as Record<number, number>);

            for (const ingredientId of Object.keys(groupedDeductions)) {
                const qty = groupedDeductions[Number(ingredientId)];
                await tx.ingredient.update({
                    where: { id: Number(ingredientId) },
                    data: { stock: { decrement: qty } }
                });
                await tx.inventoryMovement.create({
                    data: {
                        type: 'SALE_DEDUCTION',
                        quantity: qty,
                        ingredientId: Number(ingredientId),
                        subOrderId: subOrder.id,
                        userId: userId
                    }
                });
            }

            return subOrder;
        });
    }

    async cancelSubOrder(subOrderId: number) {
        return prisma.subOrder.update({
            where: {
                id: subOrderId,
            },
            data: {
                status: 'CANCELLED'
            },
            select: {
                id: true,
                label: true,
                status: true,
                order: {
                    select: {
                        id: true,
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
                },
                orderItems: {
                    select: {
                        id: true,
                        quantity: true,
                        notes: true,
                        totalPriceSnapshot: true,
                        productId: true,
                        product: { select: { name: true } }
                    }
                }
            }
        });
    }
}
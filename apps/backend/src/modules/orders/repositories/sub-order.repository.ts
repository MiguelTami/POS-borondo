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

    async sendSubOrderToCashier(subOrderId: number) {
        return prisma.subOrder.update({
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
import { prisma } from "../../../config/prisma";
import { PaymentMethod } from "@prisma/client";
import { CreatePaymentDTO } from "../types/payment.types";

export class PaymentRepository {

    async createPayment(subOrderId: number, shiftId: number, data: CreatePaymentDTO) {
        return prisma.$transaction(async (tx) => {
            await tx.subOrder.update({
                where: { id: subOrderId },
                data: {status: "PAID"}
            });
            return await tx.payment.create({
                data: {
                    subOrderId,
                    shiftId,
                    cashierId: 3,
                    ...data
                },
                include: {
                    subOrder: {
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
                                    product: { select: { name: true } }
                                }
                            }
                        }
                    }
                }
            });
        });
    }

    async getPaymentById(paymentId: number) {
        return prisma.payment.findUnique({
            where: {
                id: paymentId,
            },
            include: {
                subOrder: {
                    select: {
                        id: true,
                        label: true,
                        status: true,
                        order: {
                            select: {
                                id: true,
                                status: true,
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
                                product: { select: { name: true } }
                            }
                        }
                    }
                }
            }
        });
    }

    async getPaymentBySubOrder(subOrderId: number) {
        return prisma.payment.findFirst({
            where: {
                subOrderId: subOrderId,
            },
            include: {
                subOrder: {
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
                                product: { select: { name: true } }
                            }
                        }
                    }
                }
            }
        });
    }

    async updatePayment(paymentId: number, method: PaymentMethod) {
        return prisma.payment.update({
            where: {
                id: paymentId,
            },
            data: { method },
            include: {
                subOrder: {
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
                                product: { select: { name: true } }
                            }
                        }
                    }
                }
            }
        });
    }

    async deletePayment(paymentId: number, subOrderId: number) {
        return prisma.$transaction(async (tx) => {
            await tx.subOrder.update({
                where: { id: subOrderId },
                data: {status: "SENT_TO_CASHIER"}
            });
            return await tx.payment.delete({
                where: {
                    id: paymentId,
                }
            });
        });
    }
}
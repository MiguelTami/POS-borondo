import { prisma } from "../../../config/prisma";
import { CreateOrderItemModifier, OrderItemModifierResponse } from "../types/order-item-modifier.types";

export class OrderItemModifierRepository {
    
    async createOrderItemModifier(orderItemId: number, data: CreateOrderItemModifier): Promise<OrderItemModifierResponse> {
        const orderItemModifier = await prisma.orderItemModifier.create({
            data: {
                orderItemId,
                ...data
            },
            select: {
                id: true,
                quantity: true,
                type: true,
                ingredientId: true,
                ingredient: {
                    select: {
                        name: true,
                        unit: true,
                        stock: true
                    }
                },
                orderItemId: true,
                orderItem: {
                    select: {
                        subOrderId: true,
                        product: {
                            select: {
                                name: true
                            }
                        },
                        subOrder: {
                            select: {
                                label: true,
                                status: true,
                                orderId: true
                            }
                        }
                    }
                }

            }

        });
        return {
            ...orderItemModifier,
            quantity: orderItemModifier.quantity.toNumber(),
            ingredient: {
                ...orderItemModifier.ingredient,
                stock: orderItemModifier.ingredient.stock.toNumber()
            }
        }
    }

    async getOrderItemModifiers(orderItemId: number): Promise<OrderItemModifierResponse[]> {
        const orderItemModifiers = await prisma.orderItemModifier.findMany({
            where: {
                orderItemId
            },
            select: {
                id: true,
                quantity: true,
                type: true,
                ingredientId: true,
                ingredient: {
                    select: {
                        name: true,
                        unit: true,
                        stock: true
                    }
                },
                orderItemId: true,
                orderItem: {
                    select: {
                        subOrderId: true,
                        product: {
                            select: {
                                name: true
                            }
                        },
                        subOrder: {
                            select: {
                                label: true,
                                status: true,
                                orderId: true
                            }
                        }
                    }
                }

            }

        });
        return orderItemModifiers.map((modifier) => ({
            ...modifier,
            quantity: modifier.quantity.toNumber(),
            ingredient: {
                ...modifier.ingredient,
                stock: modifier.ingredient.stock.toNumber()
            }
        }));
    }

    async getOrderItemModifierById(id: number): Promise<OrderItemModifierResponse> {
        const orderItemModifier = await prisma.orderItemModifier.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                quantity: true,
                type: true,
                ingredientId: true,
                ingredient: {
                    select: {
                        name: true,
                        unit: true,
                        stock: true
                    }
                },
                orderItemId: true,
                orderItem: {
                    select: {
                        subOrderId: true,
                        product: {
                            select: {
                                name: true
                            }
                        },
                        subOrder: {
                            select: {
                                label: true,
                                status: true,
                                orderId: true
                            }
                        }
                    }
                }
            }

        });

        if (!orderItemModifier) {
            return null;
        }
        
        return {
            ...orderItemModifier,
            quantity: orderItemModifier.quantity.toNumber(),
            ingredient: {
                ...orderItemModifier.ingredient,
                stock: orderItemModifier.ingredient.stock.toNumber()
            }
        };
    }
}
import { prisma } from '../../../config/prisma';
import { CreateAdjustmentDTO, InventoryMovementQueryDTO } from '../types/inventory.types';
import { Prisma } from '@prisma/client';

export class InventoryRepository {

    async getMovements(query: InventoryMovementQueryDTO) {
        const { type, ingredientId, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.InventoryMovementWhereInput = {};
        
        if (type) {
            where.type = type;
        }
        
        if (ingredientId) {
            where.ingredientId = ingredientId;
        }

        const [total, data] = await prisma.$transaction([
            prisma.inventoryMovement.count({ where }),
            prisma.inventoryMovement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    ingredient: { select: { id: true, name: true, unit: true } },
                    user: { select: { id: true, name: true, role: true } },
                    subOrder: { select: { id: true, label: true } }
                }
            })
        ]);

        return {
            total,
            data,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async createAdjustment(userId: number, data: CreateAdjustmentDTO) {
        let stockChange = data.quantity;

        if (data.type === 'WASTE') {
            stockChange = -Math.abs(data.quantity);
        } else if (data.type === 'RESTOCK') {
            stockChange = Math.abs(data.quantity);
        }

        return prisma.$transaction(async (tx) => {
            const ingredientUpdated = await tx.ingredient.update({
                where: { id: data.ingredientId },
                data: {
                    stock: { increment: stockChange }
                }
            });

            const movement = await tx.inventoryMovement.create({
                data: {
                    type: data.type,
                    quantity: data.quantity,
                    ingredientId: data.ingredientId,
                    userId: userId,
                },
                include: {
                    ingredient: { select: { id: true, name: true, stock: true } },
                    user: { select: { id: true, name: true } }
                }
            });

            return movement;
        });
    }
}

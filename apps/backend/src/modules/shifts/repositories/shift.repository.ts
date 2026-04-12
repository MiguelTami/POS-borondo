import { prisma } from "../../../config/prisma";
import { Prisma } from "@prisma/client";
import { GetShiftsQueryDTO } from "../types/shift.types";

export class ShiftRepository {

    async openShift(openedById: number) {
        return prisma.shift.create({
            data: { openedById }
        });
    }

    async getActiveShift() {
        return prisma.shift.findFirst({
            where: { closedAt: null },
            include: {
                openedBy: { select: { id: true, name: true } }
            }
        });
    }

    async getShiftById(id: number) {
        return prisma.shift.findUnique({
            where: { id },
            include: {
                openedBy: { select: { id: true, name: true } },
                closedBy: { select: { id: true, name: true } },
                payments: true
            }
        });
    }

    async getShifts(filters: GetShiftsQueryDTO) {
        const where: Prisma.ShiftWhereInput = {};

        if (filters.openedById) where.openedById = filters.openedById;
        if (filters.closedById) where.closedById = filters.closedById;
        
        if (filters.startDate || filters.endDate) {
            where.openedAt = {};
            if (filters.startDate) where.openedAt.gte = new Date(filters.startDate);
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                where.openedAt.lte = end;
            }
        }

        return prisma.shift.findMany({
            where,
            orderBy: { openedAt: 'desc' },
            include: {
                openedBy: { select: { id: true, name: true } },
                closedBy: { select: { id: true, name: true } }
            }
        });
    }

    async calculateExpectedRevenue(shiftId: number) {
        const result = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { shiftId }
        });

        return result._sum.amount ? Number(result._sum.amount) : 0;
    }

    async hasOpenOrders(shiftId: number) {
        const openOrder = await prisma.order.findFirst({
            where: {
                shiftId,
                status: {
                    in: ['OPEN', 'SENT_TO_CASHIER']
                }
            }
        });
        return !!openOrder;
    }

    async closeShift(id: number, closedById: number, expectedRevenue: number, declaredCash: number, difference: number) {
        return prisma.shift.update({
            where: { id },
            data: {
                closedAt: new Date(),
                closedById,
                expectedRevenue,
                declaredCash,
                difference
            }
        });
    }
}

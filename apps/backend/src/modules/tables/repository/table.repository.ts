import { prisma } from '../../../config/prisma';
import { UpdateTableDTO, GetTablesQueryDTO} from '../types/tables.types';

export class TablesRepository {

    async getTables(filters: GetTablesQueryDTO) {
        const where: any = {
            ...(filters.status && { status: filters.status }),
            ...(filters.number && { number: filters.number }),
            ...(filters.hasOpenOrder !== undefined && { 
                orders : filters.hasOpenOrder
                    ? { some: { status: {in: ["OPEN", "SENT_TO_CASHIER"]} } }
                    : { none: { status: {in: ["OPEN", "SENT_TO_CASHIER"]} } }
            })
        };

        return prisma.table.findMany({
            where,
            select: {
                id: true,
                number: true,
                status: true
            },
            skip: (filters.page - 1) * filters.limit,
            take: filters.limit,
            orderBy: {
                [filters.sortBy]: filters.sortOrder
            }
        });
    }


    async createTable (number: number){
        const result = await prisma.table.create({
            data: {number},
            select: {
                id: true,
                number: true,
                status: true
            }

        })
        return result;
    }

    async getTableById (id: number) {
        return prisma.table.findUnique({
            where: { id },
            select: {
                id: true,
                number: true,
                status: true,
                _count: {
                    select: { orders: true }
                }
            },
        })
    }

    async getTableByNumber (number: number) {
        return prisma.table.findUnique({
            where: { number }
        })
    }

    async updateTable (id: number, data:  UpdateTableDTO) {
        return prisma.table.update({
            where: { id },
            data: { 
                status: data.status,
                number: data.number 
            },
            select: {
                id: true,
                number: true,
                status: true
            }
        })
    }

    async deleteTable (id: number) {
        return prisma.table.delete({
            where: { id }
        })
    }
}
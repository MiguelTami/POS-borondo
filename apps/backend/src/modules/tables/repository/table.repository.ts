import { prisma } from '../../../config/prisma';
import { UpdateTableDTO, GetTablesQueryDTO} from '../types/tables.types';

export class TablesRepository {

    async getTables(filters: GetTablesQueryDTO) {
        const where: any = {
            ...(filters.status && { status: filters.status }),
            ...(filters.search && { number: { contains: filters.search } }),
            ...(filters.hasOpenOrder !== undefined && { hasOpenOrder: filters.hasOpenOrder })
        };

        return prisma.table.findMany({
            where,
            skip: (filters.page - 1) * filters.limit,
            take: filters.limit,
            orderBy: {
                [filters.sortBy]: filters.sortOrder
            }
        });
    }


    async createTable (number: number) {
        return prisma.table.create({
            data: {number}
        })
    }

    async getTableById (id: number) {
        return prisma.table.findUnique({
            where: { id }
        })
    }

    async updateTable (id: number, data:  UpdateTableDTO) {
        return prisma.table.update({
            where: { id },
            data: { 
                status: data.status,
                number: data.number 
            }
        })
    }

    async deleteTable (id: number) {
        return prisma.table.delete({
            where: { id }
        })
    }
}
import { prisma } from '../../../config/prisma';
import { UpdateTableDTO } from '../types/tables.types';

export class TablesRepository {

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

    async updateTableStatus (id: number, data:  UpdateTableDTO) {
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
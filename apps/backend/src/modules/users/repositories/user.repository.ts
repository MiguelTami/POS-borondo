import { prisma } from "../../../config/prisma";
import { Prisma } from "@prisma/client";
import { CreateUserDTO, UpdateUserDTO, GetUsersQueryDTO } from "../types/user.types";

export class UserRepository {
    async getUsers(filters: GetUsersQueryDTO) {
        const where: Prisma.UserWhereInput = {};

        if (filters.role) where.role = filters.role;
        if (filters.isActive !== undefined) where.isActive = filters.isActive;

        return prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true
            },
            orderBy: { name: 'asc' }
        });
    }

    async getUserByName(name: string) {
        return prisma.user.findFirst({
            where: { name },
        });
    }

    async getUserById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    async createUser(data: CreateUserDTO) {
        return prisma.user.create({
            data: {
                name: data.name,
                password: data.password,
                role: data.role,
                isActive: true
            },
            select: {
                id: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    async updateUser(id: number, data: UpdateUserDTO) {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    async updateUserStatus(id: number, isActive: boolean) {
        return prisma.user.update({
            where: { id },
            data: { isActive },
            select: {
                id: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }
}

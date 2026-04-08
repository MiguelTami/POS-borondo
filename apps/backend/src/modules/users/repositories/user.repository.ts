import { prisma } from "../../../config/prisma";
import { CreateUserDTO } from "../types/user.types";

export class UserRepository {
    async getUserByName(name: string) {
        return prisma.user.findFirst({
            where: { name },
        });
    }

    async getUserById(id: number) {
        return prisma.user.findUnique({
            where: { id },
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
}

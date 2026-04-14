import { Role } from "@prisma/client";

export interface CreateUserDTO {
    name: string;
    password: string;
    role: Role;
}

export interface UpdateUserDTO {
    name?: string;
    currentPassword?: string;
    password?: string;
    role?: Role;
}

export interface GetUsersQueryDTO {
    role?: Role;
    isActive?: boolean;
}

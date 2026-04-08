import { Role } from "@prisma/client";

export interface CreateUserDTO {
    name: string;
    password: string;
    role: Role;
}

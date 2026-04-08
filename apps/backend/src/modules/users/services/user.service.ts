import { UserRepository } from "../repositories/user.repository";
import { CreateUserDTO, UpdateUserDTO, GetUsersQueryDTO } from "../types/user.types";
import bcrypt from "bcrypt";

export class UserService {

    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async createUser(data: CreateUserDTO) {
        const existingUser = await this.repository.getUserByName(data.name);

        if (existingUser) {
            throw new Error("El nombre de usuario ya está en uso");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const userData: CreateUserDTO = {
            ...data,
            password: hashedPassword
        };

        return await this.repository.createUser(userData);
    }

    async getUsers(filters: GetUsersQueryDTO) {
        return await this.repository.getUsers(filters);
    }

    async getUserById(id: number) {
        const user = await this.repository.getUserById(id);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        return user;
    }

    async updateUser(id: number, data: UpdateUserDTO) {
        await this.getUserById(id);

        if (data.name) {
            const existingUser = await this.repository.getUserByName(data.name);
            if (existingUser && existingUser.id !== id) {
                throw new Error("El nombre de usuario ya está en uso");
            }
        }

        const updateData: UpdateUserDTO = { ...data };

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        return await this.repository.updateUser(id, updateData);
    }

    async deactivateUser(id: number) {
        await this.getUserById(id);
        
        return await this.repository.updateUserStatus(id, false);
    }

    async activateUser(id: number) {
        await this.getUserById(id);
        
        return await this.repository.updateUserStatus(id, true);
    }
}
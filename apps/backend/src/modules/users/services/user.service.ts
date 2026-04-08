import { UserRepository } from "../repositories/user.repository";
import { CreateUserDTO } from "../types/user.types";
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
}
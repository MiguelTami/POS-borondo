import { UserRepository } from "../repositories/user.repository";
import { LoginDTO, AuthResponseDTO } from "../types/auth.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async login(data: LoginDTO): Promise<AuthResponseDTO> {
        const user = await this.repository.getUserByName(data.name);

        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        if (!user.isActive) {
            throw new Error("El usuario está inactivo");
        }

        // TODO: En producción, user.password debe ser el hash almacenado
        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
        throw new Error("Credenciales inválidas");
        }

        // Generar JWT
        const payload = { id: user.id, role: user.role };
        const secret = process.env.JWT_SECRET;

        if (!secret) {
                throw new Error("JWT_SECRET no está configurada en .env");
            }

        const token = jwt.sign(payload, secret, { expiresIn: "12h" });

        return {
        user: {
            id: user.id,
            name: user.name,
            role: user.role,
        },
        token,
        };
    }

    async getMe(userId: number) {
        const user = await this.repository.getUserById(userId);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (!user.isActive) {
            throw new Error("El usuario está inactivo");
        }

        return {
        id: user.id,
        name: user.name,
        role: user.role,
        };
    }
}
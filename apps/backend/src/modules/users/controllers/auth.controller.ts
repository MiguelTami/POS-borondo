import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    login = async (req: Request, res: Response) => {
        try {
            const data = req.validatedBody;
            const response = await this.service.login(data);

            res.status(200).json(response);
        } catch (error) {
            console.error("Error en login:", error.message);
            if (error.message === "Credenciales inválidas" || error.message === "El usuario está inactivo") {
                return res.status(401).json({ error: error.message });
            }
            res.status(500).json({ error: "Error interno del servidor al iniciar sesión" });
        }
    };

    getMe = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id;
            const user = await this.service.getMe(userId);

            res.status(200).json(user);
        } catch (error) {
            console.error("Error en getMe:", error.message);
            if (error.message === "Usuario no encontrado" || error.message === "El usuario está inactivo") {
                return res.status(401).json({ error: error.message });
            }
            res.status(500).json({ error: "Error interno del servidor al obtener usuario" });
        }
    };
}

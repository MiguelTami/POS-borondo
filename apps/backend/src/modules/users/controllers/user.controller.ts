import { UserService } from "../services/user.service";
import { Request, Response } from "express";

export class UserController {

    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    createUser = async (req: Request, res: Response) => {
        try {
            const data = req.validatedBody;
            const user = await this.service.createUser(data);

            res.status(201).json(user);
        } catch (error) {
            console.error("Error al crear usuario:", error.message);
            if (error.message === "El nombre de usuario ya está en uso") {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al crear el usuario' });
        }
    };
}
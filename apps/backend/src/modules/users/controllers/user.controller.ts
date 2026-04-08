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

    getUsers = async (req: Request, res: Response) => {
        try {
            const filters = req.validatedQuery;
            const users = await this.service.getUsers(filters);
            
            res.status(200).json(users);
        } catch (error) {
            console.error("Error al obtener usuarios:", error.message);
            res.status(500).json({ error: 'Error interno al obtener los usuarios' });
        }
    };

    getUserById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.userId);
            const user = await this.service.getUserById(id);
            
            res.status(200).json(user);
        } catch (error) {
            console.error("Error al obtener el usuario:", error.message);
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al obtener el usuario' });
        }
    };

    updateUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.userId);
            const data = req.validatedBody;
            const user = await this.service.updateUser(id, data);
            
            res.status(200).json(user);
        } catch (error) {
            console.error("Error al actualizar el usuario:", error.message);
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al actualizar el usuario' });
        }
    };

    deactivateUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.userId);
            const user = await this.service.deactivateUser(id);
            
            res.status(200).json({ message: "Usuario desactivado correctamente", user });
        } catch (error) {
            console.error("Error al desactivar el usuario:", error.message);
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al desactivar el usuario' });
        }
    };

    activateUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.userId);
            const user = await this.service.activateUser(id);
            
            res.status(200).json({ message: "Usuario activado correctamente", user });
        } catch (error) {
            console.error("Error al activar el usuario:", error.message);
            if (error.message === "Usuario no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al activar el usuario' });
        }
    };
}
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Acceso no autorizado. Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso no autorizado. Token inválido" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "Error interno: Configuración JWT faltante" });
        }

        const decoded = jwt.verify(token, secret) as { id: number; role: string };

        // Adjuntamos la información del usuario a la request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Acceso no autorizado. Token expirado o inválido" });
    }
};

// Opcional: Middleware para verificar si el usuario tiene un rol específico
export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Acceso no autorizado" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message: "Acceso denegado. No tienes los permisos necesarios"});
        }

        next();
    };
};

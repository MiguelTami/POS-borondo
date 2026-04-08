import { z } from "zod";

export const LoginSchema = z.object({
    name: z.string().min(1, "El nombre de usuario es requerido"),
    password: z.string().min(1, "La contraseña es requerida"),
}).strict();
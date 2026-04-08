import { z } from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().min(1, 'El nombre de usuario es requerido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['ADMIN', 'CASHIER', 'WAITER'])
}).strict();

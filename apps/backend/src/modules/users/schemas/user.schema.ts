import { z } from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().min(1, 'El nombre de usuario es requerido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['ADMIN', 'CASHIER', 'WAITER'])
}).strict();

export const UpdateUserSchema = z.object({
    name: z.string().min(1, 'El nombre de usuario no puede estar vacío').optional(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
    role: z.enum(['ADMIN', 'CASHIER', 'WAITER']).optional()
}).strict();

export const GetUsersQuerySchema = z.object({
    role: z.enum(['ADMIN', 'CASHIER', 'WAITER']).optional(),
    isActive: z.union([z.boolean(), z.string().transform(val => val === 'true')]).optional()
}).strict();

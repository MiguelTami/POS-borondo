import { Unit } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library';

export interface CreateIngredientDTO {
    name: string;
    unit: Unit;
    minStockAlert: number
}

export interface UpdateIngredientDTO {
    name?: string;
    unit?: Unit;
    minStockAlert?: number
}

export interface IngredientResponse {
    id: number;
    name: string;
    unit: Unit;
    stock: number | Decimal;
    minStockAlert: number;
    isActive: boolean
}

export interface DeleteIngredientResponse {
    message: string
}

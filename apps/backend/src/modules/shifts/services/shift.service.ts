import { ShiftRepository } from "../repositories/shift.repository";
import { CloseShiftDTO, GetShiftsQueryDTO } from "../types/shift.types";
import { Prisma } from "@prisma/client";

export class ShiftService {

    private repository: ShiftRepository;

    constructor() {
        this.repository = new ShiftRepository();
    }

    async openShift(openedById: number) {
        const activeShift = await this.repository.getActiveShift();
        if (activeShift) {
            throw new Error("Ya existe un turno abierto");
        }

        return this.repository.openShift(openedById);
    }

    async getActiveShift() {
        const shift = await this.repository.getActiveShift();
        if (!shift) {
            throw new Error("No hay turno activo");
        }
        return shift;
    }

    async getShiftById(id: number) {
        const shift = await this.repository.getShiftById(id);
        if (!shift) {
            throw new Error("Turno no encontrado");
        }
        return shift;
    }

    async getShifts(filters: GetShiftsQueryDTO) {
        return this.repository.getShifts(filters);
    }

    async closeShift(id: number, closedById: number, data: CloseShiftDTO) {
        const shift = await this.repository.getShiftById(id);
        
        if (!shift) {
            throw new Error("Turno no encontrado");
        }

        if (shift.closedAt) {
            throw new Error("Este turno ya se encuentra cerrado");
        }

        const expectedRevenue = await this.repository.calculateExpectedRevenue(id);
        const declaredCash = Number(data.declaredCash);
        const difference = declaredCash - expectedRevenue;

        return this.repository.closeShift(
            id,
            closedById,
            expectedRevenue,
            declaredCash,
            difference
        );
    }
}

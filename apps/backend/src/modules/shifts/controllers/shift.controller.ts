import { ShiftService } from "../services/shift.service";
import { Request, Response } from "express";

export class ShiftController {

    private service: ShiftService;

    constructor() {
        this.service = new ShiftService();
    }

    openShift = async (req: Request, res: Response) => {
        try {
            const openedById = req.user!.id;
            const { pettyCash } = req.validatedBody;
            const shift = await this.service.openShift(openedById, pettyCash);

            res.status(201).json(shift);
        } catch (error) {
            console.error("Error al abrir turno:", error.message);
            if (error.message === "Ya existe un turno abierto") {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al abrir el turno' });
        }
    };

    getActiveShift = async (req: Request, res: Response) => {
        try {
            const shift = await this.service.getActiveShift();
            res.status(200).json(shift);
        } catch (error) {
            console.error("Error al obtener turno activo:", error.message);
            if (error.message === "No hay turno activo") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al obtener el turno activo' });
        }
    };

    getShiftById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.shiftId);
            const shift = await this.service.getShiftById(id);
            
            res.status(200).json(shift);
        } catch (error) {
            console.error("Error al obtener el turno:", error.message);
            if (error.message === "Turno no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al obtener el turno' });
        }
    };

    getShifts = async (req: Request, res: Response) => {
        try {
            const filters = req.validatedQuery;
            const shifts = await this.service.getShifts(filters);
            
            res.status(200).json(shifts);
        } catch (error) {
            console.error("Error al obtener turnos:", error.message);
            res.status(500).json({ error: 'Error interno al obtener los turnos' });
        }
    };

    closeShift = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.shiftId);
            const data = req.validatedBody;
            const closedById = req.user!.id;

            const shift = await this.service.closeShift(id, closedById, data);
            
            res.status(200).json(shift);
        } catch (error) {
            console.error("Error al cerrar el turno:", error.message);
            if (error.message === "Turno no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Este turno ya se encuentra cerrado" || error.message === "No se puede cerrar el turno porque aún hay órdenes abiertas o sin pagar") {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "Este turno ya se encuentra cerrado") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error interno al cerrar el turno' });
        }
    };
}
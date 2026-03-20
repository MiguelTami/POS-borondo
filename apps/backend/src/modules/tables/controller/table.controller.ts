import { TablesService } from "../service/table.service";
import { Request, Response } from "express";
import { UpdateTableDTO } from "../types/tables.types";

export class TablesController {

    private service: TablesService;

    constructor() {
        this.service = new TablesService();
    }

    createTable = async (req: Request, res: Response) => {
        try {
            const number: number = req.validatedBody.number;
            const table = await this.service.createTable(number);
        res.status(201).json(table);
        } catch (error) {
            res.status(500).json({ error: "Failed to create table" });
        }       
    }

    getTableById = async (req: Request, res: Response) => {
        try {
            const id: number = req.validatedParams.id;
            const table = await this.service.getTableById(id);
            if (!table) {
                return res.status(404).json({ error: "Table not found" });
            }
            res.json(table);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch table" });
        }
    }

    updateTableStatus = async (req: Request, res: Response) => {
        try {
            const id: number = req.validatedParams.id;
            const data: UpdateTableDTO = req.validatedBody;
            const table = await this.service.updateTableStatus(id, data);
            res.json(table);
        } catch (error) {
            res.status(500).json({ error: "Failed to update table status" });
        }
    }

    deleteTable = async (req: Request, res: Response) => {
        try {
            const id: number = req.validatedParams.id;
            await this.service.deleteTable(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to delete table" });
        }
    }

}
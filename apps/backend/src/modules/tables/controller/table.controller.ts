import { TablesService } from "../service/table.service";
import { Request, Response } from "express";
import { GetTablesQueryDTO, UpdateTableDTO } from "../types/tables.types";

export class TablesController {

    private service: TablesService;

    constructor() {
        this.service = new TablesService();
    }

    getTables = async (req: Request, res: Response) => {
        const filters = (req as any).validatedQuery as GetTablesQueryDTO;
        try {
            
            const tables = await this.service.getTables(filters);
            res.json(tables);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch tables" });
        }
        
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
            const id: number = req.validatedParams.tableId;
            const table = await this.service.getTableById(id);
            if (!table) {
                return res.status(404).json({ error: "Table not found" });
            }
            res.json(table);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch table" });
        }
    }

    updateTable = async (req: Request, res: Response) => {
        try {
            const id: number = req.validatedParams.tableId;
            const data: UpdateTableDTO = req.validatedBody;
            const table = await this.service.updateTable(id, data);
            res.json(table);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Failed to update table" });
        }
    }

    deleteTable = async (req: Request, res: Response) => {
        try {
            const id: number = req.validatedParams.tableId;
            await this.service.deleteTable(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to delete table" });
        }
    }

}
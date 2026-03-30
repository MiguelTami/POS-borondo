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
            if (error.message === "No se encontraron mesas con los filtros proporcionados") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to fetch tables" });
        }
        
    }


    createTable = async (req: Request, res) => {
        try {
            const number: number = req.validatedBody.number;
            const table = await this.service.createTable(number);
        res.status(201).json(table);
        } catch (error) {
            if (error.message === "La mesa con ese número ya existe") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({error: "Failed to create table" });
        }       
    }

    getTableById = async (req: Request, res) => {
        try {
            const id: number = req.validatedParams.tableId;
            const table = await this.service.getTableById(id);
            if (!table) {
                return res.status(404).json({ error: "Table not found" });
            }
            res.json(table);
        } catch (error) {
            if (error.message === "La mesa no existe") {
                return res.status(404).json({ error: error.message });
            }
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
            if (error.message === "La mesa no existe") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "La mesa con ese número ya existe") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to update table" });
        }
    }

    deleteTable = async (req: Request, res: Response) => {
        try {
            const id: number = req.validatedParams.tableId;
            const result = await this.service.deleteTable(id);
            res.status(200).json(result);
        } catch (error) {
            if (error.message === "La mesa no existe") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "No se puede eliminar una mesa con órdenes asociadas") {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: "Failed to delete table" });
        }
    }

}
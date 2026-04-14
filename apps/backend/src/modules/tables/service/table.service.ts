import { TablesRepository } from "../repository/table.repository";
import { GetTablesQueryDTO, UpdateTableDTO } from "../types/tables.types";

export class TablesService {

    private repository: TablesRepository;

    constructor() {
        this.repository = new TablesRepository();
    }

    async getTables(filters: GetTablesQueryDTO) {
        const tables = await this.repository.getTables(filters);
        if (tables.length === 0) {
            throw new Error("No se encontraron mesas con los filtros proporcionados");
        }
        return tables;
    }

    async createTable (number: number){
        const existingTable = await this.repository.getTableByNumber(number);
        if (existingTable) {
            throw new Error("La mesa con ese número ya existe");
        }
        return this.repository.createTable(number);
    }

    async getTableById (id: number) {
        const table = await this.repository.getTableById(id);
        if (!table) {
            throw new Error("La mesa no existe");
        }
        return table;
    }

    async updateTable (id: number, data: UpdateTableDTO) {
        const existingTable = await this.getTableById(id);

        if (!existingTable) {
            throw new Error("La mesa no existe");
        }

        if (data.number !== undefined) {
            const tableNumber = await this.repository.getTableByNumber(data.number);
            if (tableNumber && tableNumber.id !== id) {
                throw new Error("La mesa con ese número ya existe");
            } 
        }

        return this.repository.updateTable(id, data);
    }

    async deleteTable (id: number) {
        const existingTable = await this.getTableById(id);

        if (!existingTable) {
            throw new Error("La mesa no existe");
        }

        if(existingTable._count?.orders > 0) {
            throw new Error("No se puede eliminar una mesa con órdenes asociadas");
        }

        await this.repository.deleteTable(id);
        return { message: "Mesa eliminada correctamente" };
    }
}
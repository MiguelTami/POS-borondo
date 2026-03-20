import { TablesRepository } from "../repository/table.repository";
import { GetTablesQueryDTO, UpdateTableDTO } from "../types/tables.types";

export class TablesService {

    private repository: TablesRepository;

    constructor() {
        this.repository = new TablesRepository();
    }

    async getTables(filters: GetTablesQueryDTO) {
        return this.repository.getTables(filters);
    }

    async createTable (number: number) {
        return this.repository.createTable(number);
    }

    async getTableById (id: number) {
        return this.repository.getTableById(id);
    }

    async updateTable (id: number, data: UpdateTableDTO) {
        return this.repository.updateTable(id, data);
    }

    async deleteTable (id: number) {
        return this.repository.deleteTable(id);
    }
}
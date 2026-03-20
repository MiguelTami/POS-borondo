import { TablesRepository } from "../repository/table.repository";
import { UpdateTableDTO } from "../types/tables.types";

export class TablesService {

    private repository: TablesRepository;

    constructor() {
        this.repository = new TablesRepository();
    }

    async createTable (number: number) {
        return this.repository.createTable(number);
    }

    async getTableById (id: number) {
        return this.repository.getTableById(id);
    }

    async updateTableStatus (id: number, data: UpdateTableDTO) {
        return this.repository.updateTableStatus(id, data);
    }

    async deleteTable (id: number) {
        return this.repository.deleteTable(id);
    }
}
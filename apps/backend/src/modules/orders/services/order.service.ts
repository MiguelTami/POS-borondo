import { OrderRepository } from "../repositories/order.repository";
import { prisma } from "../../../config/prisma";
import { CreateOrderDTO, OrderResponse, UpdateOrderDTO } from "../types/order.types";
import { TablesService } from "../../tables/service/table.service";

export class OrderService {
    private repository: OrderRepository;
    private tablesService: TablesService;

    constructor() {
        this.repository = new OrderRepository();
        this.tablesService = new TablesService();
    }

    async createOrder(data: CreateOrderDTO): Promise<OrderResponse> {
        const table = await this.tablesService.getTableById(data.tableId);

        if (table.status !== "AVAILABLE") {
        throw new Error("La mesa no está disponible");
        }

        const now = new Date();
        const businessDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        return this.repository.createOrder(data, businessDate);
    }

    async getOrders() {
        const orders = await this.repository.getOrders();

        if (orders.length === 0) {
            throw new Error("No se encontraron órdenes");
        }

        return orders;
    }

    async getOrderById(id: number) {
        const order = await this.repository.getOrderById(id);
        if (!order) {
            throw new Error("Orden no encontrada");
        }
        return order;
    }

    async updateOrder(id: number, data: UpdateOrderDTO): Promise<OrderResponse> {
        await this.getOrderById(id);

        const table = data.tableId !== undefined 
            ? await this.tablesService.getTableById(data.tableId) 
            : null;
        
        if(data.tableId !== undefined && table) {
            if (table.status !== "AVAILABLE") {
                throw new Error("La mesa no está disponible");
            }
        }

        return this.repository.updateOrder(id, data);
    }

    async deleteOrder(id: number) {
        await this.getOrderById(id);
        return this.repository.deleteOrder(id);
    }

    async sendOrderToCashier(id: number): Promise<OrderResponse> {
        const order = await this.getOrderById(id);

        if (order.status !== "OPEN") {
            throw new Error("Solo se pueden enviar al cajero órdenes en estado OPEN");
        }
        return this.repository.sendOrderToCashier(id);
    }

    async payOrder(id: number): Promise<OrderResponse> {
        const order = await this.getOrderById(id);

        if (order.status === "PAID") {
            throw new Error("No se puede pagar una orden que ya ha sido pagada");
        }
        if (order.status !== "SENT_TO_CASHIER") {
            throw new Error("No se puede pagar una orden que ya ha sido cancelada, o que no ha sido enviada al cajero");
        }
        return this.repository.payOrder(id);
    }

    async cancelOrder(id: number): Promise<OrderResponse> {
        const order = await this.getOrderById(id);

        if (order.status === "PAID") {
            throw new Error("No se puede cancelar una orden que ya ha sido pagada");
        }

        const hasPaidSubOrders = order.subOrders.some((subOrder: any) => subOrder.status === "PAID");
        if (hasPaidSubOrders) {
            throw new Error("No se puede cancelar una orden que tiene subórdenes pagadas");
        }

        return this.repository.cancelOrder(id);
    }  
}

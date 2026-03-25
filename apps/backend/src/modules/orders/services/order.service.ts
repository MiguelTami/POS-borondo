import { OrderRepository } from "../repositories/order.repository";
import { prisma } from "../../../config/prisma";
import { CreateOrderDTO, OrderResponse, UpdateOrderDTO } from "../types/order.types";

export class OrderService {
    private repository: OrderRepository;

    constructor() {
        this.repository = new OrderRepository();
    }

    async createOrder(data: CreateOrderDTO): Promise<OrderResponse> {
        const [table, waiter] = await Promise.all([
        prisma.table.findUnique({ where: { id: data.tableId } }),
        prisma.user.findUnique({ where: { id: data.waiterId } }),
        ]);

        if (!table) {
        throw new Error("Mesa no encontrada");
        }

        if (table.status !== "AVAILABLE") {
        throw new Error("La mesa no está disponible");
        }

        if (!waiter || waiter.role !== "WAITER") {
        throw new Error("El usuario no existe o no tiene rol de mesonero");
        }

        const now = new Date();
        const businessDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        return this.repository.createOrder(data, businessDate);
    }

    async getOrders() {
        return this.repository.getOrders();
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

        const [table, waiter] = await Promise.all([
        data.tableId ? prisma.table.findUnique({ where: { id: data.tableId } }) : null,
        data.waiterId ? prisma.user.findUnique({ where: { id: data.waiterId } }) : null,
        ]);
        
        if(data.tableId !== undefined) {
            if (!table) {
                throw new Error("Mesa no encontrada");
            }

            if (table.status !== "AVAILABLE") {
                throw new Error("La mesa no está disponible");
            }
        }
        
        if(data.waiterId !== undefined) {
            if (!waiter || waiter.role !== "WAITER") {
                throw new Error("El usuario no existe o no tiene rol de mesonero");
            }
        }

        return this.repository.updateOrder(id, data);
    }

    async deleteOrder(id: number) {
        await this.getOrderById(id);
        await prisma.order.delete({ where: { id } });
    }

    async payOrder(id: number): Promise<OrderResponse> {
        const order = await this.getOrderById(id);

        if (order.status === "CANCELLED") {
            throw new Error("No se puede pagar una orden que ya ha sido cancelada");
        }
        return this.repository.payOrder(id);
    }

    async cancelOrder(id: number): Promise<OrderResponse> {
        const order = await this.getOrderById(id);

        if (order.status === "PAID") {
            throw new Error("No se puede cancelar una orden que ya ha sido pagada");
        }
        return this.repository.cancelOrder(id);
    }  
}

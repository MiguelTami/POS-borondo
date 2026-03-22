import { OrderRepository } from "../repositories/order.repository";
import { prisma } from "../../../config/prisma";
import { CreateOrderDTO, OrderResponse, UpdateOrderDTO, updateStatusDTO } from "../types/order.types";

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
        const order = await this.repository.getOrderById(id);
        if (!order) {
            throw new Error("Orden no encontrada");
        }
        return this.repository.updateOrder(id, data);
    }

    async deleteOrder(id: number) {
        const order = await this.repository.getOrderById(id);
        if (!order) {
            throw new Error("Orden no encontrada");
        }
        await prisma.order.delete({ where: { id } });
    }

    async updateOrderStatus(id: number, status: updateStatusDTO["status"]): Promise<OrderResponse> {
        const order = await this.repository.getOrderById(id);
        if (!order) {
            throw new Error("Orden no encontrada");
        }
        return this.repository.updateOrderStatus(id, status);
    }   
}

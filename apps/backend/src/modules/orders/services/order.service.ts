import { OrderRepository } from "../repositories/order.repository";
import { prisma } from "../../../config/prisma";
import { CreateOrderDTO, OrderResponse, UpdateOrderDTO } from "../types/order.types";
import { TablesService } from "../../tables/service/table.service";
import { ShiftService } from "../../shifts/services/shift.service";

export class OrderService {
    private repository: OrderRepository;
    private tablesService: TablesService;
    private shiftService: ShiftService;

    constructor() {
        this.repository = new OrderRepository();
        this.tablesService = new TablesService();
        this.shiftService = new ShiftService();
    }

    async createOrder(data: CreateOrderDTO): Promise<OrderResponse> {
        const activeShift = await this.shiftService.getActiveShift();
        if (!activeShift) {
            throw new Error("No hay un turno activo. Debes abrir un turno antes de crear órdenes.");
        }

        const table = await this.tablesService.getTableById(data.tableId);

        if (table.status !== "AVAILABLE") {
        throw new Error("La mesa no está disponible");
        }

        const now = new Date();
        const businessDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        data.shiftId = activeShift.id;

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

    async sendOrderToCashier(id: number, userId: number): Promise<OrderResponse> {
        const order = await this.getOrderById(id);

        if (order.status !== "OPEN") {
            throw new Error("Solo se pueden enviar al cajero órdenes en estado OPEN");
        }

        const orderDetails = await this.repository.getOrderWithModifiersAndRecipes(id);
        const deductions: { ingredientId: number, quantityToDeduct: number, subOrderId: number }[] = [];

        if (orderDetails && orderDetails.subOrders) {
            for (const subOrder of orderDetails.subOrders) {
                if (subOrder.orderItems) {
                    for (const item of subOrder.orderItems) {
                        const recipeIngredients = item.product.recipes || [];

                        for (const recipeNode of recipeIngredients) {
                            let totalBaseQuantity = Number(recipeNode.quantityRequired) * item.quantity;
                            
                            const removeModifier = item.modifiers.find(
                                m => m.ingredientId === recipeNode.ingredientId && m.type === 'REMOVE'
                            );

                            if (removeModifier) {
                                totalBaseQuantity -= Number(removeModifier.quantity);
                            }

                            if (totalBaseQuantity > 0) {
                                deductions.push({
                                    ingredientId: recipeNode.ingredientId,
                                    quantityToDeduct: totalBaseQuantity,
                                    subOrderId: subOrder.id
                                });
                            }
                        }

                        const addedModifiers = item.modifiers.filter(m => m.type === 'EXTRA');
                        for (const added of addedModifiers) {
                            deductions.push({
                                ingredientId: added.ingredientId,
                                quantityToDeduct: Number(added.quantity),
                                subOrderId: subOrder.id
                            });
                        }
                    }
                }
            }
        }

        return this.repository.sendOrderToCashier(id, userId, deductions);
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

        const hasKitchenSubOrders = order.subOrders.some((subOrder: any) => subOrder.status === "SENT_TO_KITCHEN");
        if (hasKitchenSubOrders) {
            throw new Error("No se puede cancelar una orden que tiene subórdenes enviadas a la cocina");
        }

        return this.repository.cancelOrder(id);
    }  
}

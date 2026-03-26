import { OrderItemModifierRepository } from "../repositories/order-item-modifier.repository";
import { CreateOrderItemModifier, OrderItemModifierResponse } from "../types/order-item-modifier.types";
import { IngredientsService } from "../../products/services/ingredient.service";
import { OrderItemService } from "./order-item.service";

export class OrderItemModifierService {

    private repository: OrderItemModifierRepository;
    private ingredientsService: IngredientsService;
    private orderItemsService: OrderItemService;

    constructor() {
        this.repository = new OrderItemModifierRepository();
        this.ingredientsService = new IngredientsService();
        this.orderItemsService = new OrderItemService();
    }

    async createOrderItemModifier(orderItemId: number, orderId: number, subOrderId: number, data: CreateOrderItemModifier): Promise<OrderItemModifierResponse> {
        const ingredient = await this.ingredientsService.getIngredientById(data.ingredientId)
        await this.orderItemsService.getOrderItemById(orderItemId, orderId, subOrderId);

        if (!ingredient) {
            throw new Error('Ingrediente no encontrado')
        }

        if (Number(data.quantity) > Number(ingredient.stock)) {
            throw new Error('No hay suficiente stock del ingrediente para agregar esta modificación')
        }
        return this.repository.createOrderItemModifier(orderItemId, data);
    }

    async getOrderItemModifiers(orderItemId: number, orderId: number, subOrderId: number): Promise<OrderItemModifierResponse[]> {
        await this.orderItemsService.getOrderItemById(orderItemId, orderId, subOrderId)
        return this.repository.getOrderItemModifiers(orderItemId);
    }

    async getOrderItemModifierById(id: number, orderItemId: number, orderId: number, subOrderId: number): Promise<OrderItemModifierResponse> {
        const orderItemModifier = await this.repository.getOrderItemModifierById(id);

        if (!orderItemModifier) {
            throw new Error('Order item modifier no encontrada')
        }
        if (orderItemModifier.orderItemId !== orderItemId) {
            throw new Error('Order item modifier no pertenece al order item')
        }
        if (orderItemModifier.orderItem.subOrderId !== subOrderId) {
            throw new Error('Order item modifier no pertenece a la suborden')
        }
        if (orderItemModifier.orderItem.subOrder.orderId !== orderId) {
            throw new Error('Order item modifier no pertenece a la orden')
        }
        return orderItemModifier;
    }
}
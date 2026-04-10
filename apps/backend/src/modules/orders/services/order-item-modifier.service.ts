import { OrderItemModifierRepository } from "../repositories/order-item-modifier.repository";
import { CreateOrderItemModifier, OrderItemModifierResponse, UpdateOrderItemModifier } from "../types/order-item-modifier.types";
import { IngredientsService } from "../../products/services/ingredient.service";
import { OrderItemService } from "./order-item.service";
import { RecipesService } from "../../products/services/recipe.service";

export class OrderItemModifierService {

    private repository: OrderItemModifierRepository;
    private ingredientsService: IngredientsService;
    private orderItemsService: OrderItemService;
    private recipesService: RecipesService;

    constructor() {
        this.repository = new OrderItemModifierRepository();
        this.ingredientsService = new IngredientsService();
        this.orderItemsService = new OrderItemService();
        this.recipesService = new RecipesService();
    }

    async createOrderItemModifier(orderItemId: number, orderId: number, subOrderId: number, data: CreateOrderItemModifier): Promise<OrderItemModifierResponse> {
        const ingredient = await this.ingredientsService.getIngredientById(data.ingredientId)
        const orderItem = await this.orderItemsService.getOrderItemById(orderItemId, orderId, subOrderId);

        if (orderItem.subOrder.status === "PAID" || orderItem.subOrder.status === "SENT_TO_CASHIER") {
            throw new Error("No se pueden agregar modificaciones a una sub-orden que ya ha sido pagada o enviada al cajero");
        }
        if (!ingredient) {
            throw new Error('Ingrediente no encontrado')
        }

        if (data.type === 'REMOVE') {
            const productId = orderItem.productId;
            const ingredientId = data.ingredientId;
            const recipeItems = await this.recipesService.getIngredientsProduct(productId, ingredientId);
            if (recipeItems.length === 0) {
                throw new Error('No se puede quitar un ingrediente que no forma parte de la receta del producto');
            }
            if (Number(data.quantity) > Number(recipeItems[0].quantityRequired) * orderItem.quantity) {
                throw new Error('No puedes remover una cantidad mayor a la que dicta la receta');
            }
        }

        if (data.type === 'EXTRA') {
            let baseQuantity = 0;
            const recipeItems = await this.recipesService.getIngredientsProduct(orderItem.productId, data.ingredientId);
            if (recipeItems.length > 0) {
                baseQuantity = Number(recipeItems[0].quantityRequired) * orderItem.quantity;
            }

            if (Number(data.quantity) + baseQuantity > Number(ingredient.stock)) {
                throw new Error('No hay suficiente stock del ingrediente para agregar esta modificación')
            }
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

    async updateOrderItemModifier(id: number, orderItemId: number, orderId: number, subOrderId: number, data: UpdateOrderItemModifier): Promise<OrderItemModifierResponse> {
        const orderItemModifier = await this.getOrderItemModifierById(id, orderItemId, orderId, subOrderId);
        const ingredient = await this.ingredientsService.getIngredientById(data.ingredientId || orderItemModifier.ingredientId);
        const orderItem = await this.orderItemsService.getOrderItemById(orderItemId, orderId, subOrderId);

        if (orderItem.subOrder.status === "PAID" || orderItem.subOrder.status === "SENT_TO_CASHIER") {
            throw new Error("No se pueden modificar las modificaciones de una sub-orden que ya ha sido pagada o enviada al cajero");
        }

        const modifierType = data.type || orderItemModifier.type;
        const ingredientId = data.ingredientId || orderItemModifier.ingredientId;

        if (modifierType === 'REMOVE') {
            const recipeItems = await this.recipesService.getIngredientsProduct(orderItem.productId, ingredientId);
            if (recipeItems.length === 0) {
                throw new Error('No se puede quitar un ingrediente que no forma parte de la receta del producto');
            }
            if (Number(data.quantity || orderItemModifier.quantity) > Number(recipeItems[0].quantityRequired) * orderItem.quantity) {
                throw new Error('No puedes remover una cantidad mayor a la que dicta la receta');
            }
        }

        if (modifierType === 'EXTRA') {
            let baseQuantity = 0;
            const recipeItems = await this.recipesService.getIngredientsProduct(orderItem.productId, ingredientId);
            if (recipeItems.length > 0) {
                baseQuantity = Number(recipeItems[0].quantityRequired) * orderItem.quantity;
            }

            if (Number(data.quantity || orderItemModifier.quantity) + baseQuantity > Number(ingredient.stock)) {
                throw new Error('No hay suficiente stock del ingrediente para agregar esta modificación')
            }
        } 
        return this.repository.updateOrderItemModifier(id, data);
    }

    async deleteOrderItemModifier(id: number, orderItemId: number, orderId: number, subOrderId: number) {
        const orderItem = await this.orderItemsService.getOrderItemById(orderItemId, orderId, subOrderId);

        if (orderItem.subOrder.status === "PAID" || orderItem.subOrder.status === "SENT_TO_CASHIER") {
            throw new Error("No se pueden eliminar las modificaciones de una sub-orden que ya ha sido pagada o enviada al cajero");
        }

        await this.getOrderItemModifierById(id, orderItemId, orderId, subOrderId);
        return this.repository.deleteOrderItemModifier(id);
    }
}
import { OrderItemRepository } from "../repositories/order-item.repository";
import { SubOrderService } from "./sub-order.service";
import { RecipesService } from "../../products/services/recipe.service";
import { ProductsService } from "../../products/services/product.service";
import { CreateOrderItemDTO, CreateItemRequest, ResponseOrderItem, UpdateOrderItemDTO } from "../types/order-item.types";

export class OrderItemService {
    
    private repository: OrderItemRepository;
    private productService: ProductsService;
    private subOrderService: SubOrderService;
    private recipesService: RecipesService;

    constructor() {
        this.repository = new OrderItemRepository();
        this.productService = new ProductsService();
        this.subOrderService = new SubOrderService();
        this.recipesService = new RecipesService();
    }

    async createOrderItem(orderId: number, subOrderId: number, data: CreateItemRequest, userId: number): Promise<ResponseOrderItem> {
        const product = await this.productService.getProductById(data.productId);
        const recipes = await this.recipesService.getIngredientsRecipe(data.productId);
        const subOrder = await this.subOrderService.getSubOrderById(orderId, subOrderId);

        if (subOrder.status === "PAID" || subOrder.status === "SENT_TO_CASHIER") {
            throw new Error("No se pueden agregar items a una sub-orden que ya ha sido pagada o enviada al cajero");
        }

        const ingredientsToDeduct = [];
        for (const recipe of recipes) {
            const requiredQuantity = Number(recipe.quantityRequired) * data.quantity;
            if (Number(recipe.ingredient.stock) < requiredQuantity) {
                throw new Error(`No hay suficiente stock del ingrediente ${recipe.ingredient.name} para preparar el producto ${product.name}`);
            }
            ingredientsToDeduct.push({
                ingredientId: recipe.ingredientId,
                quantityToDeduct: requiredQuantity
            });
        }

        const unitPrice = Number(product.price);
        const totalPrice = unitPrice * data.quantity;

        const createData: CreateOrderItemDTO = {
            ...data,
            unitPrice,
            totalPrice
        };

        return this.repository.createOrderItemWithDeduction(subOrderId, createData, userId, ingredientsToDeduct);  
    }

    async getOrderItems(orderId: number, subOrderId: number): Promise<ResponseOrderItem[]> {
        await this.subOrderService.getSubOrderById(orderId, subOrderId);
        return this.repository.getOrderItems(subOrderId);
    }

    async getOrderItemById(id: number, orderId: number, subOrderId: number): Promise<ResponseOrderItem> {
        const orderItem = await this.repository.getOrderItemById(id);
        if (!orderItem) {
            throw new Error("Order item no encontrada");
        }
        if (orderItem.subOrderId !== subOrderId) {
            throw new Error("Order item no pertenece a la suborden");
        }
        if (orderItem.subOrder.orderId !== orderId) {
            throw new Error("Order item no pertenece a la orden");
        }
        return orderItem;
    }

    async updateOrderItem(id: number, orderId: number, subOrderId: number, data: UpdateOrderItemDTO): Promise<ResponseOrderItem> {
        const orderItem = await this.getOrderItemById(id, orderId, subOrderId);
        const subOrder = await this.subOrderService.getSubOrderById(orderId, subOrderId);

        if (subOrder.status === "PAID" || subOrder.status === "SENT_TO_CASHIER") {
            throw new Error("No se pueden modificar items a una sub-orden que ya ha sido pagada o enviada al cajero");
        }

        if (!data.productId && !data.quantity) {
            return this.repository.updateOrderItem(id, data);
        }

        let finalUnitPrice = Number(orderItem.unitPriceSnapshot);
        let finalQuantity = orderItem.quantity;

        if (data.productId) {
            const product = await this.productService.getProductById(data.productId);

            finalUnitPrice = Number(product.price);
            data.unitPriceSnapshot = finalUnitPrice;
        }

        if (data.quantity) {
            finalQuantity = data.quantity;
        }

        data.totalPriceSnapshot = finalUnitPrice * finalQuantity;

        return this.repository.updateOrderItem(id, data);
    }

    async deleteOrderItem(id: number, orderId: number, subOrderId: number) {
        await this.getOrderItemById(id, orderId, subOrderId);
        return this.repository.deleteOrderItem(id);
    }
}

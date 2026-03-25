import { OrderItemRepository } from "../repositories/order-item.repository";
import { SubOrderService } from "./sub-order.service";
import { ProductsRepository } from "../../products/repositories/product.repository";
import { CreateOrderItemDTO, CreateItemRequest, ResponseOrderItem, UpdateOrderItemDTO } from "../types/order-item.types";

export class OrderItemService {
    
    private repository: OrderItemRepository;
    private productRepository: ProductsRepository;
    private subOrderService: SubOrderService;

    constructor() {
        this.repository = new OrderItemRepository();
        this.productRepository = new ProductsRepository();
        this.subOrderService = new SubOrderService();
    }

    async createOrderItem(subOrderId: number, data: CreateItemRequest): Promise<ResponseOrderItem> {
        const product = await this.productRepository.findProductById(data.productId);
        if (!product) {
            throw new Error("Product not found");
        }

        const unitPrice = Number(product.price);
        const totalPrice = unitPrice * data.quantity;

        const createData: CreateOrderItemDTO = {
            ...data,
            unitPrice,
            totalPrice
        };

        return this.repository.createOrderItem(subOrderId, createData);  
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

        if (!data.productId && !data.quantity) {
            return this.repository.updateOrderItem(id, data);
        }

        let finalUnitPrice = Number(orderItem.unitPriceSnapshot);
        let finalQuantity = orderItem.quantity;

        if (data.productId) {
            const product = await this.productRepository.findProductById(data.productId);

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

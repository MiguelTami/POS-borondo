import { OrderItemRepository } from "../repositories/order-item.repository";
import { ProductsRepository } from "../../products/repositories/product.repository";
import { CreateOrderItemDTO, CreateItemRequest } from "../types/order-item.types";

export class OrderItemService {
    
    private repository: OrderItemRepository;
    private productRepository: ProductsRepository;

    constructor() {
        this.repository = new OrderItemRepository();
        this.productRepository = new ProductsRepository();
    }

    async createOrderItem(subOrderId: number, data: CreateItemRequest) {
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

    async getOrderItems(subOrderId: number) {
        return this.repository.getOrderItems(subOrderId);
    }
}

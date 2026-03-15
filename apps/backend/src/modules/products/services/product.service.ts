import { ProductsRepository } from "../repositories/product.repository";
import { 
    CreateProductDTO, 
    ProductResponse, 
    DeleteProductResponse, 
    UpdateProductDTO,
    GetProductQueryDTO
 } from '../types/product.types';

export class ProductsService {

    private repository: ProductsRepository;

    constructor() {
        this.repository = new ProductsRepository();
    }

    async getProducts(filters: GetProductQueryDTO) {
        const products = await this.repository.findAllActive(filters);

        return products
    }

    async getProductById(id: number) {
        const product = await this.repository.findProductById(id)

        return product
    }

    async createProduct(data: CreateProductDTO): Promise<ProductResponse> {
        const product = await this.repository.createProduct(data);

        return {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            isActive: product.isActive,
            category: {
                id: product.category.id,
                name: product.category.name
            }
        }
    }

    async desactivateProduct(id: number): Promise<DeleteProductResponse> {
        await this.repository.desactivateProduct(id)
        return {
            message: 'Product desactivated succesfully'
        }
    }

    async reactivateProduct(id: number): Promise<DeleteProductResponse> {
        await this.repository.reactivateProduct(id)
        return {
            message: 'Product reactivated succesfully'
        }
    }

    async updateProduct(productId: number, data: UpdateProductDTO): Promise<ProductResponse> {
        const updatedProduct = await this.repository.updateProduct(productId, data);

        return {
            id: updatedProduct.id,
            name: updatedProduct.name,
            price: Number(updatedProduct.price),
            isActive: updatedProduct.isActive,
            category: {
                id: updatedProduct.category.id,
                name: updatedProduct.category.name
            }
        }
    }
}
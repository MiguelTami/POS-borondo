import { ProductsRepository } from "./product.repository";
import { 
    CreateProductDTO, 
    ProductResponse, 
    DeleteProductResponse, 
    UpdateProductDTO } from "./product.types";

export class ProductsService {

    private repository: ProductsRepository;

    constructor() {
        this.repository = new ProductsRepository();
    }

    async getProducts() {
        const products = await this.repository.findAllActive();

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

    async deleteProduct(id: number): Promise<DeleteProductResponse> {
        await this.repository.deleteProduct(id)
        return {
            message: 'Product deleted succesfully'
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
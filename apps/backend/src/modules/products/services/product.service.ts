import { ProductsRepository } from "../repositories/product.repository";
import { CategoriesService } from "./category.service";
import { 
    CreateProductDTO, 
    ProductResponse, 
    DeleteProductResponse, 
    UpdateProductDTO,
    GetProductQueryDTO
 } from '../types/product.types';

export class ProductsService {

    private repository: ProductsRepository;
    private categoryService: CategoriesService;

    constructor() {
        this.repository = new ProductsRepository();
        this.categoryService = new CategoriesService();
    }

    async getProducts(filters: GetProductQueryDTO) {
        const products = await this.repository.getActiveCategories(filters);

        if (products.length === 0) {
            throw new Error('No se encontraron productos con los filtros proporcionados');
        }

        return products
    }

    async getProductById(id: number) {
        const product = await this.repository.getProductById(id)

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return product
    }

    async createProduct(data: CreateProductDTO): Promise<ProductResponse> {
        const category = await this.categoryService.getCategoryById(data.categoryId);
        
        const existingProduct = await this.repository.getProductByName(data.name);
        if (existingProduct) {
            throw new Error(`Ya existe un producto con el nombre: ${data.name}`);
        }
        
        if (!category.isActive) {
            throw new Error('La categoría está inactiva');
        }

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
        const product = await this.getProductById(id);

        if (!product.isActive) {
            throw new Error('El producto ya está inactivo');
        }

        await this.repository.desactivateProduct(id)
        return {
            message: 'Producto desactivado exitosamente'
        }
    }

    async reactivateProduct(id: number): Promise<DeleteProductResponse> {
        const product = await this.getProductById(id);

        if (product.isActive) {
            throw new Error('El producto ya está activo');
        }

        await this.repository.reactivateProduct(id)
        return {
            message: 'Producto reactivado exitosamente'
        }
    }

    async updateProduct(productId: number, data: UpdateProductDTO): Promise<ProductResponse> {
        const product = await this.getProductById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        
        if (data.categoryId) {
            const category = await this.categoryService.getCategoryById(data.categoryId);
            if (!category.isActive) {
                throw new Error('La categoría está inactiva');
            }
        }

        if (data.name) {
            const existingProduct = await this.repository.getProductByName(data.name);
            if (existingProduct && existingProduct.id !== productId) {
                throw new Error(`Ya existe un producto con el nombre: ${data.name}`);
            }
        }


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
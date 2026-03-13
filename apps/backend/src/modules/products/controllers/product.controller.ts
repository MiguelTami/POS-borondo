import { Request, Response } from 'express'
import { ProductsService } from '../services/product.service'
import { CreateProductDTO, UpdateProductDTO, GetProductQueryDTO } from '../types/product.types'

export class ProductsController {

    private service: ProductsService;

    constructor() {
        this.service = new ProductsService()
    }

    getProducts = async (req: Request, res: Response) => {
        const filters: GetProductQueryDTO = {
        categoryId: req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined,

        isActive: req.query.isActive
        ? req.query.isActive === "true"
        : undefined,

        search: req.query.search
        ? String(req.query.search)
        : undefined
  }
        try {
            
            const products = await this.service.getProducts(filters);

            res.status(200).json(products);

        } catch (error) {
            res.status(500).json({
                message: 'Error fetching products'
            });
        }
    };

    getProductById = async (req: Request, res: Response) => {
        try {
            const productId = Number(req.params.id);
            const product = await this.service.getProductById(productId);

            res.status(200).json(product)
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching product'
            })
        }
    }

    createProduct = async (req: Request, res: Response) => {
        try {
            
            const data: CreateProductDTO = req.body;
            const product = await this.service.createProduct(data);

            res.status(201).json(product)

        } catch (error) {
            res.status(500).json({
                message: "Error creating product"
            });
        }
    }

    deleteProduct = async (req: Request, res: Response) => {
        try {
            const productId = Number(req.params.id)
            const result = await this.service.deleteProduct(productId)

            res.status(200).json(result)
        } catch (error) {
           res.status(500).json({
                message: "Error deleting product"
            }); 
        }
    }

    updateProduct = async (req: Request, res: Response) => {
        try {
            const productId = Number(req.params.id);
            const data: UpdateProductDTO = req.body;

            const updatedProduct = await this.service.updateProduct(productId, data)

            res.status(200).json(updatedProduct)
        } catch (error) {
            res.status(500).json({
                message: "Error updating product"
            });
        }
    }
}
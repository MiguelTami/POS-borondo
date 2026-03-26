import { Request, Response } from 'express'
import { ProductsService } from '../services/product.service'
import { CreateProductDTO, UpdateProductDTO, GetProductQueryDTO } from '../types/product.types'

export class ProductsController {

    private service: ProductsService;

    constructor() {
        this.service = new ProductsService()
    }

    getProducts = async (req: Request, res: Response) => {
        const filters = (req as any).validatedQuery as GetProductQueryDTO
        try {
            
            const products = await this.service.getProducts(filters);

            res.status(200).json(products);

        } catch (error) {
            if (error.message === 'No se encontraron productos con los filtros proporcionados') {
                return res.status(404).json({
                    message: error.message
                });
            }
            res.status(500).json({
                message: 'Error fetching products'
            });
        }
    };

    getProductById = async (req: Request, res: Response) => {
        try {
            const productId = req.validatedParams.productId;
            const product = await this.service.getProductById(productId);

            res.status(200).json(product)
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    message: error.message
                });
            }

            res.status(500).json({
                message: 'Error fetching product'
            })
        }
    }

    createProduct = async (req: Request, res: Response) => {
        try {
            
            const data: CreateProductDTO = req.validatedBody;
            const product = await this.service.createProduct(data);

            res.status(201).json(product)

        } catch (error) {
            if (error.message === 'La categoría no existe' || error.message === 'La categoría está inactiva') {
                return res.status(400).json({
                    message: error.message
                });
            }
            if (error.message.startsWith('Ya existe un producto con el nombre')) {
                return res.status(409).json({
                    message: error.message
                });
            }
            res.status(500).json({
                message: "Error creating product"
            });
        }
    }

    desactivateProduct = async (req: Request, res: Response) => {
        try {
            const productId = req.validatedParams.productId
            const result = await this.service.desactivateProduct(productId)

            res.status(200).json(result)
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    message: error.message
                });
            }
            if (error.message === 'El producto ya está inactivo') {
                return res.status(400).json({
                    message: error.message
                });
            }
            res.status(500).json({
                message: "Error deleting product"
            }); 
        }
    }

    reactivateProduct = async (req: Request, res: Response) => {
        try {
            const productId = req.validatedParams.productId
            const result = await this.service.reactivateProduct(productId)

            res.status(200).json(result)
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    message: error.message
                });
            }
            if (error.message === 'El producto ya está activo') {
                return res.status(400).json({
                    message: error.message
                });
            }
            res.status(500).json({
                message: "Error reactivating product"
            }); 
        }
    }

    updateProduct = async (req: Request, res: Response) => {
        try {
            const productId = req.validatedParams.productId;
            const data: UpdateProductDTO = req.validatedBody;

            const updatedProduct = await this.service.updateProduct(productId, data)

            res.status(200).json(updatedProduct)
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    message: error.message
                });
            }
            if (error.message === 'La categoría no existe' || error.message === 'La categoría está inactiva') {
                return res.status(400).json({
                    message: error.message
                });
            }
            if (error.message.startsWith('Ya existe un producto con el nombre')) {
                return res.status(409).json({
                    message: error.message
                });
            }
            res.status(500).json({
                message: "Error updating product"
            });
        }
    }
}
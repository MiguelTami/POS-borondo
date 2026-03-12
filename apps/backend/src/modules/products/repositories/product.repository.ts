import { prisma }   from '../../../config/prisma';
import { CreateProductDTO, UpdateProductDTO } from '../types/product.types'

export class ProductsRepository {

    async findAllActive() {
        return prisma.product.findMany({
            where: {
                isActive: true,
            },
            include: {
                category: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async findProductById(id: number) {
        return prisma.product.findUnique({
            where: {id}
        })
    }

    async createProduct(data: CreateProductDTO) {
        return prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                categoryId: data.categoryId,
                isActive: true
            },
            include: {
                category: true
            }
        })
    }

    async deleteProduct(productId: number) {
        return prisma.product.update({
            where: {
                id: productId
            },
            data: {
                isActive: false
            }
        })
    }

    async updateProduct(productId: number, data: UpdateProductDTO) {
        return prisma.product.update({
            where: {id: productId},
            data,
            include: {
                category: true
            }
        })
    }
}


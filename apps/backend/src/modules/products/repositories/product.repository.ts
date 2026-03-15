import { prisma }   from '../../../config/prisma';
import { Prisma } from "@prisma/client";
import { CreateProductDTO, UpdateProductDTO, GetProductQueryDTO } from '../types/product.types'

export class ProductsRepository {

    async findAllActive(filters: GetProductQueryDTO) {
        const where: Prisma.ProductWhereInput = {
            ...(filters.categoryId && {
            categoryId: filters.categoryId
            }),

            ...(filters.isActive !== undefined && {
            isActive: filters.isActive
            }),

            ...(filters.search && {
            name: {
                contains: filters.search,
                mode: "insensitive"
            }
            })
        }
        return prisma.product.findMany({
            where,
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

    async desactivateProduct(productId: number) {
        return prisma.product.update({
            where: {
                id: productId
            },
            data: {
                isActive: false
            }
        })
    }

    async reactivateProduct(productId: number) {
        return prisma.product.update({
            where: {
                id: productId
            },
            data: {
                isActive: true
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


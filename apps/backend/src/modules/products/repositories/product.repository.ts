import { prisma }   from '../../../config/prisma';
import { Prisma } from "@prisma/client";
import { CreateProductDTO, UpdateProductDTO, GetProductQueryDTO } from '../types/product.types'

export class ProductsRepository {

    async getProducts(filters: GetProductQueryDTO) {
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
            select: {
                id: true,
                name: true,
                price: true,
                isActive: true,
                categoryId: true,
                category: {
                    select: {
                        name: true
                    }
                },
                recipes: {
                    select: {
                        id: true,
                        ingredientId: true,
                        quantityRequired: true,
                        ingredient: {
                            select: {
                                stock: true,
                                name: true,
                                unit: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async getProductByName(name: string) {
        return prisma.product.findFirst({
            where: { name }
        });
    }

    async getProductById(id: number) {
        return prisma.product.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                price: true,
                isActive: true,
                categoryId: true,
                category: {
                    select: {
                        name: true
                    }
                }
            }
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
            select: {
                id: true,
                name: true,
                price: true,
                isActive: true,
                categoryId: true,
                category: {
                    select: {
                        name: true
                    }
                }
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
            select: {
                id: true,
                name: true,
                price: true,
                isActive: true,
                categoryId: true,
                category: {
                    select: {
                        name: true
                    }
                }
            }
        })
    }
}


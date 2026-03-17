import { CategoriesService } from '../services/category.service';
import { Request, Response } from 'express'
import { UpdateCategoryDTO } from '../types/category.types';

export class CategoriesController {

    private service: CategoriesService

    constructor() {
        this.service = new CategoriesService()
    }

    createCategory = async (req: Request, res: Response) => {
        try {
            const categoryName: string = req.body
            const categoryCreated = await this.service.createCategory(categoryName)

            res.status(201).json(categoryCreated)
        } catch (error) {
            res.status(500).json({
                message: 'Error creating category'
            })
        }
    }

    getCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.service.getCategories()

            res.status(200).json(categories)
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching categories'
            })
        }
    }

    getCategoryById = async (req: Request, res: Response) => {
        try {
            const categoryId: number = req.params.categoryId
            const category = await this.service.getCategoryById(categoryId)

            res.status(200).json(category)
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching category'
            })
        }
    }

    updateCategory = async (req: Request, res: Response) => {
        try {
            const categoryId: number = req.params.categoryId
            const data: UpdateCategoryDTO = req.body

            const categotyUpdated = await this.service.updateCategory(categoryId, data)

            res.status(200).json(categotyUpdated)
        } catch (error) {
            res.status(500).json({
                message: 'Error updating category'
            })
        }
    }

    desactivateCategory = async (req: Request, res: Response) => {
        try {
            const categoryId: number = req.params.categoryId

            const categoryDesactivated = await this.service.desactivateCategory(categoryId)
            
            res.status(200).json(categoryDesactivated)
        } catch (error) {
            res.status(500).json({
                message: 'Error desactivating category'
            })
        }
    }

    reactivateCategory = async (req: Request, res: Response) => {
        try {
            const categoryId: number = req.params.categoryId

            const categoryDesactivated = await this.service.desactivateCategory(categoryId)
            
            res.status(200).json(categoryDesactivated)
        } catch (error) {
            res.status(500).json({
                message: 'Error reactivating category'
            })
        }
    }
}
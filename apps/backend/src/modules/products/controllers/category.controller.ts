import { CategoriesService } from '../services/category.service';
import { Request, Response } from 'express'

export class CategoriesController {

    private service: CategoriesService

    constructor() {
        this.service = new CategoriesService()
    }

    createCategory = async (req: Request, res: Response) => {
        try {
            const categoryName: string = req.validatedBody.name
            console.log(categoryName)
            const categoryCreated = await this.service.createCategory(categoryName)

            res.status(201).json(categoryCreated)
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Error creating category'
            })
        }
    }

    getActiveCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.service.getActiveCategories()

            res.status(200).json(categories)
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Error fetching categories'
            })
        }
    }

    getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.service.getAllCategories()

            res.status(200).json(categories)
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Error fetching categories'
            })
        }
    }

    getCategoryById = async (req: Request, res: Response) => {
        try {
            const categoryId: number = req.validatedParams.categoryId
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
            const categoryId: number = req.validatedParams.categoryId
            const name: string = req.validatedBody.name

            const categotyUpdated = await this.service.updateCategory(categoryId, name)

            res.status(200).json(categotyUpdated)
        } catch (error) {
            console.error(error.message)
            res.status(500).json({
                message: 'Error updating category'
            })
        }
    }

    desactivateCategory = async (req: Request, res: Response) => {
        try {
            const categoryId: number = req.validatedParams.categoryId

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
            const categoryId: number = req.validatedParams.categoryId

            const categoryReactivated = await this.service.reactivateCategory(categoryId)
            
            res.status(200).json(categoryReactivated)
        } catch (error) {
            res.status(500).json({
                message: 'Error reactivating category'
            })
        }
    }
}
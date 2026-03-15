import { Router } from 'express'
import { CategoriesController } from '../controllers/category.controller'

const controller = new CategoriesController()
const router = Router()

router.post('/', controller.createCategory) // /categories
router.get('/', controller.getCategories) // /categories
router.get('/:categoryId', controller.getCategoryById) // /categories/:categoryId
router.patch('/:categoryId', controller.updateCategory) // /categories/:categoryId
router.delete('/:categoryId', controller.desactivatecategory) // /categories/:categoryId
router.patch('/:categoryId/reactivate', controller.desactivatecategory) // /categories/:categoryId/reactivate

export default router
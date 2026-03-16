import { Router } from 'express'
import { CategoriesController } from '../controllers/category.controller'
import { validateParams } from '../../../shared/validations/middlewares/validateParams'
import { categoryIdParamSchema } from '../../../shared/validations/schemas/params.schemas'

const controller = new CategoriesController()
const router = Router()

router.post('/', controller.createCategory) // /categories
router.get('/', controller.getCategories) // /categories
router.get('/:categoryId', validateParams(categoryIdParamSchema), controller.getCategoryById) // /categories/:categoryId
router.patch('/:categoryId', validateParams(categoryIdParamSchema), controller.updateCategory) // /categories/:categoryId
router.delete('/:categoryId', validateParams(categoryIdParamSchema), controller.desactivatecategory) // /categories/:categoryId
router.patch('/:categoryId/reactivate', validateParams(categoryIdParamSchema), controller.desactivatecategory) // /categories/:categoryId/reactivate

export default router
import { Router } from 'express'
import { CategoriesController } from '../controllers/category.controller'
import { validate } from '../../../middlewares/validate.middleware'
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema'
import { categoryIdParamSchema } from '../../../shared/validations/schemas/params.schema'

const controller = new CategoriesController()
const router = Router()

router.post('/', validate(createCategorySchema), controller.createCategory) // /categories
router.get('/', controller.getCategories) // /categories
router.get('/:categoryId', validate(categoryIdParamSchema, 'params'), controller.getCategoryById) // /categories/:categoryId
router.patch('/:categoryId', validate(categoryIdParamSchema, 'params'), validate(updateCategorySchema), controller.updateCategory) // /categories/:categoryId
router.delete('/:categoryId', validate(categoryIdParamSchema, 'params'), controller.desactivateCategory) // /categories/:categoryId
router.patch('/:categoryId/reactivate', validate(categoryIdParamSchema, 'params'), controller.reactivateCategory) // /categories/:categoryId/reactivate

export default router
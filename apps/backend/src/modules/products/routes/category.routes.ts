import { Router } from 'express'
import { CategoriesController } from '../controllers/category.controller'
import { validate } from '../../../middlewares/validate.middleware'
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema'
import { categoryIdParamSchema } from '../../../shared/validations/schemas/params.schema'
import { authorizeRole } from '../../../middlewares/auth.middleware'

const controller = new CategoriesController()
const router = Router()

router.post('/', authorizeRole(['ADMIN']), validate(createCategorySchema), controller.createCategory)
router.get('/', controller.getActiveCategories)
router.get('/all', controller.getAllCategories)    
router.get('/:categoryId', validate(categoryIdParamSchema, 'params'), controller.getCategoryById)
router.patch('/:categoryId', authorizeRole(['ADMIN']), validate(categoryIdParamSchema, 'params'), validate(updateCategorySchema), controller.updateCategory)
router.delete('/:categoryId', authorizeRole(['ADMIN']), validate(categoryIdParamSchema, 'params'), controller.desactivateCategory)
router.patch('/:categoryId/reactivate', authorizeRole(['ADMIN']), validate(categoryIdParamSchema, 'params'), controller.reactivateCategory)

export default router
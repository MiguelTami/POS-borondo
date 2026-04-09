import { Router } from 'express'
import { CategoriesController } from '../controllers/category.controller'
import { validate } from '../../../middlewares/validate.middleware'
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema'
import { categoryIdParamSchema } from '../../../shared/validations/schemas/params.schema'
import { authenticate, authorizeRole } from '../../../middlewares/auth.middleware'

const controller = new CategoriesController()
const router = Router()

router.post('/', authenticate, authorizeRole(['ADMIN']), validate(createCategorySchema), controller.createCategory)
router.get('/', authenticate, controller.getActiveCategories)
router.get('/all', authenticate, controller.getAllCategories)    
router.get('/:categoryId', authenticate, validate(categoryIdParamSchema, 'params'), controller.getCategoryById)
router.patch('/:categoryId', authenticate, authorizeRole(['ADMIN']), validate(categoryIdParamSchema, 'params'), validate(updateCategorySchema), controller.updateCategory)
router.delete('/:categoryId', authenticate, authorizeRole(['ADMIN']), validate(categoryIdParamSchema, 'params'), controller.desactivateCategory)
router.patch('/:categoryId/reactivate', authenticate, authorizeRole(['ADMIN']), validate(categoryIdParamSchema, 'params'), controller.reactivateCategory)

export default router
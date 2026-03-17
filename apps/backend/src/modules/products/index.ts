import { Router } from 'express'

import productRoutes from './routes/product.routes'
import ingredientRoutes from './routes/ingredient.routes'
import recipeRoutes from './routes/recipe.routes'
import categoryRoutes from './routes/category.routes'

const router = Router()

router.use('/products', productRoutes)

router.use('/ingredients', ingredientRoutes)

router.use('/recipes', recipeRoutes)

router.use('/categories', categoryRoutes)

export default router
import { Router } from 'express'
import productsRoutes from './modules/products/product.routes'

const router = Router();

router.use('/products', productsRoutes);

export default router
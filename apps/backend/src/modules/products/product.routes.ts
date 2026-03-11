import { Router } from 'express'
import { ProductsController } from "./product.controller";

const router = Router();
const controller = new ProductsController();

router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById)
router.post('/', controller.createProduct)
router.delete('/:id', controller.deleteProduct)
router.patch('/:id', controller.updateProduct)

export default router
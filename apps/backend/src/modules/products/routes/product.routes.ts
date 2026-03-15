import { Router } from "express";
import { ProductsController } from "../controllers/product.controller";

const router = Router();
const controller = new ProductsController();

router.get("/", controller.getProducts);
router.get("/:productId", controller.getProductById);
router.post("/", controller.createProduct);
router.delete("/:productId", controller.desactivateProduct);
router.patch("/:productId/reactivate", controller.reactivateProduct);
router.patch("/:productId", controller.updateProduct);

export default router;

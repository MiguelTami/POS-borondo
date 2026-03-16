import { Router } from "express";
import { ProductsController } from "../controllers/product.controller";
import { validateParams } from "../../../shared/validations/middlewares/validateParams";
import { productIdParamSchema } from "../../../shared/validations/schemas/params.schemas";

const router = Router();
const controller = new ProductsController();

router.get("/", controller.getProducts);
router.get("/:productId", validateParams(productIdParamSchema), controller.getProductById);
router.post("/", controller.createProduct);
router.delete("/:productId", validateParams(productIdParamSchema), controller.desactivateProduct);
router.patch("/:productId/reactivate", validateParams(productIdParamSchema), controller.reactivateProduct);
router.patch("/:productId", validateParams(productIdParamSchema), controller.updateProduct);

export default router;

import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { authorizeRole } from "../../../middlewares/auth.middleware";
import { moveInventoryQuerySchema, createAdjustmentSchema } from "../schemas/inventory.schema";

const router = Router();
const controller = new InventoryController();

router.get('/movements', authorizeRole(['ADMIN']), validate(moveInventoryQuerySchema, 'query'), controller.getMovements);
router.post('/movements/adjust', authorizeRole(['ADMIN']), validate(createAdjustmentSchema), controller.createAdjustment);

router.get('/stock/alerts', authorizeRole(['ADMIN']), controller.getStockAlerts);

export default router;

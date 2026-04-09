import { Router } from "express";
import { SubOrderController } from "../controllers/sub-order.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { createSubOrderSchema, updateSubOrderSchema } from "../schemas/sub-order.schema";
import { subOrderIdParamSchema, orderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import orderItemRoutes from "./order-item.routes";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";

const combinedParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema);

const router = Router({ mergeParams: true });
const controller = new SubOrderController();

router.post("/", authenticate, authorizeRole(['WAITER']), validate(createSubOrderSchema, 'body'), controller.createSubOrder);
router.get("/", controller.getSubOrders);
router.get("/:subOrderId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.getSubOrderById);
router.patch("/:subOrderId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), validate(updateSubOrderSchema, 'body'), controller.updateSubOrder);
router.delete("/:subOrderId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.deleteSubOrder);
router.patch("/:subOrderId/send-to-cashier", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.sendSubOrderToCashier);
router.patch("/:subOrderId/cancel", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.cancelSubOrder);


router.use("/:subOrderId/items", validate(combinedParamsSchema, 'params'), orderItemRoutes);

export default router;
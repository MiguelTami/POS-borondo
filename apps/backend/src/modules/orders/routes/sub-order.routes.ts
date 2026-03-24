import { Router } from "express";
import { SubOrderController } from "../controllers/sub-order.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { createSubOrderSchema, updateSubOrderSchema } from "../schemas/sub-order.schema";
import { subOrderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import orderItemRoutes from "./order-item.routes";

const router = Router({ mergeParams: true });
const controller = new SubOrderController();

router.post("/", validate(createSubOrderSchema, 'body'), controller.createSubOrder);
router.get("/", controller.getSubOrders);
router.get("/:subOrderId", validate(subOrderIdParamSchema, 'params'), controller.getSubOrderById);
router.patch("/:subOrderId", validate(subOrderIdParamSchema, 'params'), validate(updateSubOrderSchema, 'body'), controller.updateSubOrder);
router.delete("/:subOrderId", validate(subOrderIdParamSchema, 'params'), controller.deleteSubOrder);
router.patch("/:subOrderId/send-to-cashier", validate(subOrderIdParamSchema, 'params'), controller.sendSubOrderToCashier);
router.patch("/:subOrderId/pay", validate(subOrderIdParamSchema, 'params'), controller.paySubOrder);
router.patch("/:subOrderId/cancel", validate(subOrderIdParamSchema, 'params'), controller.cancelSubOrder);


router.use("/:subOrderId/items", validate(subOrderIdParamSchema, 'params'), orderItemRoutes);

export default router;
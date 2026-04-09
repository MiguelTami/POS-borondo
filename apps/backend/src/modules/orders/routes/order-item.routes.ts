import { Router } from "express";
import { OrderItemController } from "../controllers/order-item.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { itemIdParamSchema, orderIdParamSchema, subOrderIdParamSchema} from "../../../shared/validations/schemas/params.schema";
import { createOrderItemSchema, updateOrderItemSchema } from "../schemas/order-item.schema";
import orderItemModifierRoutes from "./order-item-modifier.routes";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";

const combinedParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema);
const parentParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema);

const router = Router({ mergeParams: true });
const controller = new OrderItemController();

router.post("/", authenticate, authorizeRole(['WAITER']), validate(parentParamsSchema, 'params') ,validate(createOrderItemSchema, 'body'), controller.createOrderItem);
router.get("/", validate(parentParamsSchema, 'params'), controller.getOrderItems);
router.get("/:itemId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.getOrderItemById);
router.patch("/:itemId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), validate(updateOrderItemSchema, 'body'), controller.updateOrderItem);
router.delete("/:itemId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.deleteOrderItem);

router.use("/:itemId/modifiers", validate(combinedParamsSchema, 'params'), orderItemModifierRoutes);

export default router;
import { Router } from "express";
import { OrderItemModifierController } from "../controllers/order-item-modifier.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { itemIdParamSchema, orderIdParamSchema, subOrderIdParamSchema, modifierIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { createOrderItemModifierSchema, updateOrderItemModifierSchema } from "../schemas/order-item-modifier.schema";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";

const combinedParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema).merge(modifierIdParamSchema);
const parentsParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema);

const router = Router({ mergeParams: true });
const controller = new OrderItemModifierController();

router.post("/", authenticate, authorizeRole(['WAITER']), validate(parentsParamsSchema, 'params'), validate(createOrderItemModifierSchema, 'body'), controller.createOrderItemModifier);
router.get("/", authenticate, validate(parentsParamsSchema, 'params'), controller.getOrderItemModifiers);
router.get("/:modifierId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.getOrderItemModifierById);
router.patch("/:modifierId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), validate(updateOrderItemModifierSchema, 'body'), controller.updateOrderItemModifier);
router.delete("/:modifierId", authenticate, authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.deleteOrderItemModifier);

export default router;
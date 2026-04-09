import { Router } from "express";
import { OrderItemModifierController } from "../controllers/order-item-modifier.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { itemIdParamSchema, orderIdParamSchema, subOrderIdParamSchema, modifierIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { authorizeRole } from "../../../middlewares/auth.middleware";
import { createOrderItemModifierSchema, updateOrderItemModifierSchema } from "../schemas/order-item-modifier.schema";

const combinedParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema).merge(modifierIdParamSchema);
const parentsParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema);

const router = Router({ mergeParams: true });
const controller = new OrderItemModifierController();

router.post("/", authorizeRole(['WAITER']), validate(parentsParamsSchema, 'params'), validate(createOrderItemModifierSchema, 'body'), controller.createOrderItemModifier);
router.get("/", validate(parentsParamsSchema, 'params'), controller.getOrderItemModifiers);
router.get("/:modifierId", authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.getOrderItemModifierById);
router.patch("/:modifierId", authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), validate(updateOrderItemModifierSchema, 'body'), controller.updateOrderItemModifier);
router.delete("/:modifierId", authorizeRole(['WAITER']), validate(combinedParamsSchema, 'params'), controller.deleteOrderItemModifier);

export default router;
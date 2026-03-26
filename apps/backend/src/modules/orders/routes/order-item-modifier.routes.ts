import { Router } from "express";
import { OrderItemModifierController } from "../controllers/order-item-modifier.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { itemIdParamSchema, orderIdParamSchema, subOrderIdParamSchema, modifierIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { createOrderItemModifierSchema, updateOrderItemModifierSchema } from "../schemas/order-item-modifier.schema";

const combinedParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema).merge(modifierIdParamSchema);
const parentsParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema);

const router = Router({ mergeParams: true });
const controller = new OrderItemModifierController();

router.post("/", validate(parentsParamsSchema, 'params'), validate(createOrderItemModifierSchema, 'body'), controller.createOrderItemModifier);
router.get("/", validate(parentsParamsSchema, 'params'), controller.getOrderItemModifiers);
router.get("/:modifierId", validate(combinedParamsSchema, 'params'), controller.getOrderItemModifierById);
router.patch("/:modifierId", validate(combinedParamsSchema, 'params'), validate(updateOrderItemModifierSchema, 'body'), controller.updateOrderItemModifier);
router.delete("/:modifierId", validate(combinedParamsSchema, 'params'), controller.deleteOrderItemModifier);

export default router;
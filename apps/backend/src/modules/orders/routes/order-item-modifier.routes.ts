import { Router } from "express";
import { OrderItemModifierController } from "../controllers/order-item-modifier.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { itemIdParamSchema, orderIdParamSchema, subOrderIdParamSchema, modifierIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { createOrderItemModifierSchema } from "../schemas/order-item-modifier.schema";

const combinedParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema).merge(modifierIdParamSchema);
const parentsParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema);

const router = Router({ mergeParams: true });
const controller = new OrderItemModifierController();

router.post("/", validate(parentsParamsSchema, 'params'), validate(createOrderItemModifierSchema, 'body'), controller.createOrderItemModifier);
router.get("/", validate(parentsParamsSchema, 'params'), controller.getOrderItemModifiers);

export default router;
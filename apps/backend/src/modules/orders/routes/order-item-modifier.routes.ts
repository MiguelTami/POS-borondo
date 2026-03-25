import { Router } from "express";
import { OrderItemModifierController } from "../controllers/order-item-modifier.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { itemIdParamSchema, orderIdParamSchema, subOrderIdParamSchema, modifierIdParamSchema } from "../../../shared/validations/schemas/params.schema";

const combinedParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema).merge(modifierIdParamSchema);
const parentsParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema);

const router = Router({ mergeParams: true });
const controller = new OrderItemModifierController();

export default router;
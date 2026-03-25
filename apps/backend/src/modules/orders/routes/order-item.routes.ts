import { Router } from "express";
import { OrderItemController } from "../controllers/order-item.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { itemIdParamSchema, orderIdParamSchema, subOrderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { createOrderItemSchema, updateOrderItemSchema } from "../schemas/order-item.schema";

const combinedParamsSchema = orderIdParamSchema.merge(subOrderIdParamSchema).merge(itemIdParamSchema);
const orderIdAndSubOrderIdSchema = orderIdParamSchema.merge(subOrderIdParamSchema);

const router = Router({ mergeParams: true });
const controller = new OrderItemController();

router.post("/", validate(orderIdAndSubOrderIdSchema, 'params') ,validate(createOrderItemSchema, 'body'), controller.createOrderItem);
router.get("/", validate(orderIdAndSubOrderIdSchema, 'params'), controller.getOrderItems);
router.get("/:itemId", validate(combinedParamsSchema, 'params'), controller.getOrderItemById);
router.patch("/:itemId", validate(combinedParamsSchema, 'params'), validate(updateOrderItemSchema, 'body'), controller.updateOrderItem);

export default router;
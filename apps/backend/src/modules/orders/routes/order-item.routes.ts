import { Router } from "express";
import { OrderItemController } from "../controllers/order-item.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { itemIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { createOrderItemSchema } from "../schemas/order-item.schema";

const router = Router({ mergeParams: true });
const controller = new OrderItemController();

router.post("/", validate(createOrderItemSchema, 'body'), controller.createOrderItem);
router.get("/", controller.getOrderItems);

export default router;
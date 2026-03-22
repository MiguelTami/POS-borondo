import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { createOrderSchema, updateOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema";
import { validate } from "../../../middlewares/validate.middleware";
import { orderIdParamSchema } from "../../../shared/validations/schemas/params.schema";

const router = Router();
const controller = new OrderController();

router.post("/", validate(createOrderSchema), controller.createOrder);
router.get("/", controller.getOrders);
router.get("/:orderId", validate(orderIdParamSchema), controller.getOrderById);
router.patch("/:orderId", validate(orderIdParamSchema), validate(updateOrderSchema), controller.updateOrder);
router.delete("/:orderId", validate(orderIdParamSchema), controller.deleteOrder);
router.patch("/:orderId/status", validate(orderIdParamSchema), validate(updateOrderStatusSchema), controller.updateOrderStatus);

export default router;
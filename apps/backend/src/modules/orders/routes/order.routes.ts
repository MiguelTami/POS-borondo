import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { createOrderSchema, updateOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema";
import { validate } from "../../../middlewares/validate.middleware";
import { orderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import subOrderRoutes from '../routes/sub-order.routes' 

const router = Router();
const controller = new OrderController();

router.post("/", validate(createOrderSchema, 'body'), controller.createOrder);
router.get("/", controller.getOrders);
router.get("/:orderId", validate(orderIdParamSchema, 'params'), controller.getOrderById);
router.patch("/:orderId", validate(orderIdParamSchema, 'params'), validate(updateOrderSchema, 'body'), controller.updateOrder);
router.delete("/:orderId", validate(orderIdParamSchema, 'params'), controller.deleteOrder);
router.patch("/:orderId/status", validate(orderIdParamSchema, 'params'), validate(updateOrderStatusSchema, 'body'), controller.updateOrderStatus);

router.use("/:orderId", validate(orderIdParamSchema, 'params'), subOrderRoutes);

export default router;
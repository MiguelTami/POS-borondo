import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { createOrderSchema, updateOrderSchema } from "../schemas/order.schema";
import { validate } from "../../../middlewares/validate.middleware";
import { orderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import subOrderRoutes from '../routes/sub-order.routes' 
import { authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new OrderController();

router.post("/", authorizeRole(['WAITER']), validate(createOrderSchema, 'body'), controller.createOrder);
router.get("/", controller.getOrders);
router.get("/:orderId", validate(orderIdParamSchema, 'params'), controller.getOrderById);
router.patch("/:orderId", authorizeRole(['WAITER']), validate(orderIdParamSchema, 'params'), validate(updateOrderSchema, 'body'), controller.updateOrder);
router.delete("/:orderId", authorizeRole(['WAITER']), validate(orderIdParamSchema, 'params'), controller.deleteOrder);
router.patch("/:orderId/send-to-cashier", authorizeRole(['WAITER']), validate(orderIdParamSchema, 'params'), controller.sendOrderToCashier);
router.patch("/:orderId/pay", authorizeRole(['CASHIER', 'ADMIN']), validate(orderIdParamSchema, 'params'), controller.payOrder);
router.patch("/:orderId/cancel", authorizeRole(['WAITER', 'CASHIER']), validate(orderIdParamSchema, 'params'), controller.cancelOrder);

router.use("/:orderId/sub-orders", validate(orderIdParamSchema, 'params'), subOrderRoutes);

export default router;
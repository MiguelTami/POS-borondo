import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { createOrderSchema, updateOrderSchema } from "../schemas/order.schema";
import { validate } from "../../../middlewares/validate.middleware";
import { orderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import subOrderRoutes from '../routes/sub-order.routes' 
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new OrderController();

router.post("/", authenticate, authorizeRole(['WAITER']), validate(createOrderSchema, 'body'), controller.createOrder);
router.get("/", authenticate, controller.getOrders);
router.get("/:orderId", validate(orderIdParamSchema, 'params'), controller.getOrderById);
router.patch("/:orderId", authenticate, authorizeRole(['WAITER']), validate(orderIdParamSchema, 'params'), validate(updateOrderSchema, 'body'), controller.updateOrder);
router.delete("/:orderId", authenticate, authorizeRole(['WAITER']), validate(orderIdParamSchema, 'params'), controller.deleteOrder);
router.patch("/:orderId/send-to-cashier", authenticate, authorizeRole(['WAITER']), validate(orderIdParamSchema, 'params'), controller.sendOrderToCashier);
router.patch("/:orderId/pay", authenticate, authorizeRole(['CASHIER', 'ADMIN']), validate(orderIdParamSchema, 'params'), controller.payOrder);
router.patch("/:orderId/cancel", authenticate, authorizeRole(['WAITER']), validate(orderIdParamSchema, 'params'), controller.cancelOrder);

router.use("/:orderId/sub-orders", authenticate, validate(orderIdParamSchema, 'params'), subOrderRoutes);

export default router;
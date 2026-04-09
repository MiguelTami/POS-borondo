import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { paymentIdParamSchema, subOrderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { CreatePaymentSchema, UpdatePaymentSchema, GetPaymentsQuerySchema } from "../schemas/payment.schema";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new PaymentController();

router.get("/", authenticate, authorizeRole(['CASHIER', 'ADMIN']), validate(GetPaymentsQuerySchema, 'query'), controller.getPayments);
router.post("/", authenticate, authorizeRole(['CASHIER']), validate(CreatePaymentSchema, 'body'), controller.createPayment);
router.get("/:paymentId", authenticate, authorizeRole(['CASHIER', 'ADMIN']), validate(paymentIdParamSchema, 'params'), controller.getPaymentById);
router.get("/sub-order/:subOrderId", authenticate, authorizeRole(['CASHIER', 'ADMIN']), validate(subOrderIdParamSchema, 'params'), controller.getPaymentBySubOrder);
router.patch("/:paymentId", authenticate, authorizeRole(['ADMIN']), validate(paymentIdParamSchema, 'params'), validate(UpdatePaymentSchema, 'body'), controller.updatePayment);
router.delete("/:paymentId", authenticate, authorizeRole(['ADMIN']), validate(paymentIdParamSchema, 'params'), controller.deletePayment);

export default router;
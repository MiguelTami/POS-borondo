import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { paymentIdParamSchema, subOrderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { CreatePaymentSchema, UpdatePaymentSchema, GetPaymentsQuerySchema } from "../schemas/payment.schema";
import { authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new PaymentController();

router.get("/", authorizeRole(['CASHIER', 'ADMIN']), validate(GetPaymentsQuerySchema, 'query'), controller.getPayments);
router.post("/", authorizeRole(['CASHIER']), validate(CreatePaymentSchema, 'body'), controller.createPayment);
router.get("/:paymentId", authorizeRole(['CASHIER', 'ADMIN']), validate(paymentIdParamSchema, 'params'), controller.getPaymentById);
router.get("/sub-order/:subOrderId", authorizeRole(['CASHIER', 'ADMIN']), validate(subOrderIdParamSchema, 'params'), controller.getPaymentBySubOrder);
router.patch("/:paymentId", authorizeRole(['ADMIN']), validate(paymentIdParamSchema, 'params'), validate(UpdatePaymentSchema, 'body'), controller.updatePayment);
router.delete("/:paymentId", authorizeRole(['ADMIN']), validate(paymentIdParamSchema, 'params'), controller.deletePayment);

export default router;
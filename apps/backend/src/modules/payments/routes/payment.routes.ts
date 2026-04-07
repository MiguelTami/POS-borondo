import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { paymentIdParamSchema, subOrderIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { CreatePaymentSchema, UpdatePaymentSchema, GetPaymentsQuerySchema } from "../schemas/payment.schema";

const router = Router();
const controller = new PaymentController();

router.get("/", validate(GetPaymentsQuerySchema, 'query'), controller.getPayments);
router.post("/", validate(CreatePaymentSchema, 'body'), controller.createPayment);
router.get("/:paymentId", validate(paymentIdParamSchema, 'params'), controller.getPaymentById);
router.get("/sub-order/:subOrderId", validate(subOrderIdParamSchema, 'params'), controller.getPaymentBySubOrder);
router.patch("/:paymentId", validate(paymentIdParamSchema, 'params'), validate(UpdatePaymentSchema, 'body'), controller.updatePayment);
router.delete("/:paymentId", validate(paymentIdParamSchema, 'params'), controller.deletePayment);

export default router;
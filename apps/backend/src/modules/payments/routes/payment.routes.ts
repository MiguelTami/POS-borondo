import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { paymentIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { CreatePaymentSchema } from "../schemas/payment.schema";

const router = Router();
const controller = new PaymentController();

router.post("/", validate(CreatePaymentSchema, 'body'), controller.createPayment);

export default router;
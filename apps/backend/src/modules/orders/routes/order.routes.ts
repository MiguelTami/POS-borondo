import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { createOrderSchema } from "../schemas/order.schema";
import { validate } from "../../../middlewares/validate.middleware";

const router = Router();
const controller = new OrderController();

router.post("/", validate(createOrderSchema), controller.createOrder);

export default router;
import { Router } from "express";
import { SubOrderController } from "../controllers/sub-order.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { createSubOrderSchema } from "../schemas/sub-order.schema";
import { subOrderIdParamSchema } from "../../../shared/validations/schemas/params.schema";

const router = Router({ mergeParams: true });
const controller = new SubOrderController();

router.post("/", validate(createSubOrderSchema, 'body'), controller.createSubOrder);

export default router;
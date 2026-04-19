import { Router } from "express";
import { ShiftController } from "../controllers/shift.controller";
import { shiftIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { validate } from "../../../middlewares/validate.middleware";
import { CloseShiftSchema, GetShiftsQuerySchema, OpenShiftSchema } from "../schemas/shift.schema";
import { authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new ShiftController();

router.post("/open", authorizeRole(['ADMIN', 'CASHIER']), validate(OpenShiftSchema, 'body'), controller.openShift);
router.get("/active", controller.getActiveShift);
router.get("/:shiftId", authorizeRole(['ADMIN', 'CASHIER']), validate(shiftIdParamSchema, 'params'), controller.getShiftById);
router.get("/", authorizeRole(['ADMIN', 'CASHIER']), validate(GetShiftsQuerySchema, 'query'), controller.getShifts);
router.post("/:shiftId/close", authorizeRole(['ADMIN', 'CASHIER']), validate(shiftIdParamSchema, 'params'), validate(CloseShiftSchema, 'body'), controller.closeShift);

export default router;
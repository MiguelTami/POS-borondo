import { Router } from "express";
import { ShiftController } from "../controllers/shift.controller";
import { shiftIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { validate } from "../../../middlewares/validate.middleware";
import { CloseShiftSchema, GetShiftsQuerySchema } from "../schemas/shift.schema";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new ShiftController();

router.post("/open", authenticate, authorizeRole(['ADMIN', 'CASHIER']), controller.openShift);
router.get("/active", authenticate, controller.getActiveShift);
router.get("/:shiftId", authenticate, authorizeRole(['ADMIN', 'CASHIER']), validate(shiftIdParamSchema, 'params'), controller.getShiftById);
router.get("/", authenticate, authorizeRole(['ADMIN', 'CASHIER']), validate(GetShiftsQuerySchema, 'query'), controller.getShifts);
router.post("/:shiftId/close", authenticate, authorizeRole(['ADMIN', 'CASHIER']), validate(shiftIdParamSchema, 'params'), validate(CloseShiftSchema, 'body'), controller.closeShift);

export default router;
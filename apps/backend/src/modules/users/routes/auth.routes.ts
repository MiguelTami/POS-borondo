import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { LoginSchema } from "../schemas/auth.schema";

const router = Router();
const controller = new AuthController();

router.post("/login", validate(LoginSchema, "body"), controller.login);
router.get("/me", authenticate, controller.getMe);

export default router;

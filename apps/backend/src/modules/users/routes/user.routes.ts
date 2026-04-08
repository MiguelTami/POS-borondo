import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { userIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { validate } from "../../../middlewares/validate.middleware";
import { CreateUserSchema } from "../schemas/user.schema";
import authRoutes from "./auth.routes";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new UserController();

router.post("/", authenticate, authorizeRole(['ADMIN']), validate(CreateUserSchema, 'body'), controller.createUser);

router.use("/auth", authRoutes);

export default router;
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { userIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { validate } from "../../../middlewares/validate.middleware";
import authRoutes from "./auth.routes";

const router = Router();
const controller = new UserController();

router.use("/auth", authRoutes);

export default router;
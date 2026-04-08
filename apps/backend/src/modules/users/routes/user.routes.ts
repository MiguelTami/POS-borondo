import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { userIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { validate } from "../../../middlewares/validate.middleware";
import { CreateUserSchema, UpdateUserSchema, GetUsersQuerySchema } from "../schemas/user.schema";
import authRoutes from "./auth.routes";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new UserController();

router.use("/auth", authRoutes);

router.post("/", authenticate, authorizeRole(['ADMIN']), validate(CreateUserSchema, 'body'), controller.createUser);
router.get("/", authenticate, authorizeRole(['ADMIN']), validate(GetUsersQuerySchema, 'query'), controller.getUsers);
router.get("/:userId", authenticate, authorizeRole(['ADMIN']), validate(userIdParamSchema, 'params'), controller.getUserById);
router.patch("/:userId", authenticate, authorizeRole(['ADMIN']), validate(userIdParamSchema, 'params'), validate(UpdateUserSchema, 'body'), controller.updateUser);
router.patch("/:userId/activate", authenticate, authorizeRole(['ADMIN']), validate(userIdParamSchema, 'params'), controller.activateUser);
router.delete("/:userId", authenticate, authorizeRole(['ADMIN']), validate(userIdParamSchema, 'params'), controller.deactivateUser);

export default router;
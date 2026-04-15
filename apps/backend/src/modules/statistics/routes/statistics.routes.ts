import { Router } from "express";
import { StatisticsController } from "../controllers/statistics.controller";
import { authorizeRole } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { getStatisticsSchema, getShiftOrdersSchema } from "../schemas/statistics.schema";

const router = Router();
const controller = new StatisticsController();

// Aplicar middleware de autenticación a todas las rutas
router.use(authorizeRole(["ADMIN"]));

// Listar ventas e ingresos
router.get(
    "/summary",
    validate(getStatisticsSchema, "query"),
    controller.getSummary.bind(controller)
);

// Pedidos por turno (Listado)
router.get(
    "/shifts/:shiftId/orders",
    validate(getShiftOrdersSchema, "params"),
    controller.getShiftOrders.bind(controller)
);

// Top productos
router.get(
    "/top-products",
    validate(getStatisticsSchema, "query"),
    controller.getTopProducts.bind(controller)
);

// Ingredientes más usados
router.get(
    "/top-ingredients",
    validate(getStatisticsSchema, "query"),
    controller.getTopIngredients.bind(controller)
);

export default router;
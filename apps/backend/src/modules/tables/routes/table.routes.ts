import { TablesController } from "../controller/table.controller";
import { Router } from "express";

const router = Router();
const controller = new TablesController();

router.post("/", controller.createTable);
router.get("/:id", controller.getTableById);
router.patch("/:id", controller.updateTableStatus);
router.delete("/:id", controller.deleteTable);

export default router
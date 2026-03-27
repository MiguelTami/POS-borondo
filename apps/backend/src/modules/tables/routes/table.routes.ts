import { TablesController } from "../controller/table.controller";
import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { tableIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { createTableSchema, updateTableSchema } from '../schema/table.schema';
import { getTablesQuerySchema } from "../../tables/schema/table.query.schema";

const router = Router();
const controller = new TablesController();

router.post("/", validate(createTableSchema, 'body'), controller.createTable);
router.get("/", validate(getTablesQuerySchema, 'query'), controller.getTables);
router.get("/:tableId", validate(tableIdParamSchema, 'params'), controller.getTableById);
router.patch("/:tableId", validate(tableIdParamSchema, 'params'), validate(updateTableSchema, 'body'), controller.updateTable);
router.delete("/:tableId", validate(tableIdParamSchema, 'params'), controller.deleteTable);

export default router
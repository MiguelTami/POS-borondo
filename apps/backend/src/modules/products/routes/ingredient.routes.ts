import { Router } from "express";
import { IngredientsController } from "../controllers/ingredient.controller";
import { validateParams } from "../../../shared/validations/middlewares/validateParams";
import { ingredientIdParamSchema } from "../../../shared/validations/schemas/params.schemas";

const router = Router();
const controller = new IngredientsController();

router.get('/', controller.getIngredients);
router.get('/:ingredientId', validateParams(ingredientIdParamSchema), controller.getIngredientById);
router.post('/', controller.createIngredient);
router.patch('/:ingredientId', validateParams(ingredientIdParamSchema), controller.updateIngredient);
router.delete('/:ingredientId', validateParams(ingredientIdParamSchema), controller.disactivateIngredient);
router.patch('/:ingredientId/reactivate', validateParams(ingredientIdParamSchema), controller.activateIngredient);

export default router;
import { Router } from "express";
import { IngredientsController } from "../controllers/ingredient.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { createIngredientSchema, updateIngredientSchema } from "../schemas/ingredient.schema";
import { ingredientIdParamSchema } from "../../../shared/validations/schemas/params.schema";


const router = Router();
const controller = new IngredientsController();

router.get('/', controller.getIngredients);
router.get('/:ingredientId', validate(ingredientIdParamSchema, 'params'), controller.getIngredientById);
router.post('/', validate(createIngredientSchema), controller.createIngredient);
router.patch('/:ingredientId', validate(ingredientIdParamSchema, 'params'), validate(updateIngredientSchema), controller.updateIngredient);
router.delete('/:ingredientId', validate(ingredientIdParamSchema, 'params'), controller.disactivateIngredient);
router.patch('/:ingredientId/reactivate', validate(ingredientIdParamSchema, 'params'), controller.activateIngredient);

export default router;
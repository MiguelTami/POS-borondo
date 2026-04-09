import { Router } from "express";
import { IngredientsController } from "../controllers/ingredient.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { createIngredientSchema, updateIngredientSchema } from "../schemas/ingredient.schema";
import { ingredientIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { authorizeRole } from "../../../middlewares/auth.middleware";


const router = Router();
const controller = new IngredientsController();

router.get('/', controller.getActiveIngredients);
router.get('/all', controller.getAllIngredients); 
router.get('/:ingredientId', validate(ingredientIdParamSchema, 'params'), controller.getIngredientById);
router.post('/', authorizeRole(['ADMIN']), validate(createIngredientSchema), controller.createIngredient);
router.patch('/:ingredientId', authorizeRole(['ADMIN']), validate(ingredientIdParamSchema, 'params'), validate(updateIngredientSchema), controller.updateIngredient);
router.delete('/:ingredientId', authorizeRole(['ADMIN']), validate(ingredientIdParamSchema, 'params'), controller.disactivateIngredient);
router.patch('/:ingredientId/reactivate', authorizeRole(['ADMIN']), validate(ingredientIdParamSchema, 'params'), controller.activateIngredient);

export default router;
import { Router } from "express";
import { IngredientsController } from "../controllers/ingredient.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { createIngredientSchema, updateIngredientSchema } from "../schemas/ingredient.schema";
import { ingredientIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";


const router = Router();
const controller = new IngredientsController();

router.get('/', authenticate, controller.getActiveIngredients);
router.get('/all', authenticate, controller.getAllIngredients); 
router.get('/:ingredientId', authenticate, validate(ingredientIdParamSchema, 'params'), controller.getIngredientById);
router.post('/', authenticate, authorizeRole(['ADMIN']), validate(createIngredientSchema), controller.createIngredient);
router.patch('/:ingredientId', authenticate, authorizeRole(['ADMIN']), validate(ingredientIdParamSchema, 'params'), validate(updateIngredientSchema), controller.updateIngredient);
router.delete('/:ingredientId', authenticate, authorizeRole(['ADMIN']), validate(ingredientIdParamSchema, 'params'), controller.disactivateIngredient);
router.patch('/:ingredientId/reactivate', authenticate, authorizeRole(['ADMIN']), validate(ingredientIdParamSchema, 'params'), controller.activateIngredient);

export default router;
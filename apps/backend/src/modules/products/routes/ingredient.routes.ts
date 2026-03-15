import { Router } from "express";
import { IngredientsController } from "../controllers/ingredient.controller";

const router = Router();
const controller = new IngredientsController();

router.get('/', controller.getIngredients);
router.get('/:ingredientId', controller.getIngredientById);
router.post('/', controller.createIngredient);
router.patch('/:ingredientId', controller.updateIngredient);
router.delete('/:ingredientId', controller.disactivateIngredient);
router.patch('/:ingredientId/reactivate', controller.activateIngredient);

export default router;
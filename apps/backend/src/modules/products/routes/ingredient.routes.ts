import { Router } from "express";
import { IngredientsController } from "../controllers/ingredient.controller";

const router = Router();
const controller = new IngredientsController();

router.get('/', controller.getIngredients);
router.get('/:id', controller.getIngredientById);
router.post('/', controller.createIngredient);
router.patch('/:id', controller.updateIngredient);
router.delete('/:id', controller.disactivateIngredient);
router.patch('/:id/activate', controller.activateIngredient);

export default router;
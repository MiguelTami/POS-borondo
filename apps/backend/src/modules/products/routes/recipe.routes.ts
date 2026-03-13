import { RecipesController } from "../controllers/recipe.controller";
import { Router } from 'express'

const router = Router();
const controller = new RecipesController();

router.post('/', controller.createIngredientRecipe)

export default router
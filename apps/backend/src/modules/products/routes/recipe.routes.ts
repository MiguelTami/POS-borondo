import { RecipesController } from "../controllers/recipe.controller";
import { Router } from 'express'

const router = Router();
const controller = new RecipesController();

router.post('/', controller.createIngredientRecipe) //products/:productId/recipes

export default router
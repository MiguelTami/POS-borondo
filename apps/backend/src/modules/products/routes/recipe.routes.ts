import { RecipesController } from "../controllers/recipe.controller";
import { Router } from 'express'

const router = Router();
const controller = new RecipesController();

router.get('/', controller.getIngredientsRecipe) //products/:productId/recipes
router.post('/', controller.createIngredientRecipe) //products/:productId/recipes
router.patch('/:recipeId', controller.updateIngredientRecipe) //recipes/:recipeId
router.delete('/:recipeId', controller.deleteIngredientrecipe) //recipes/:recipeId

export default router
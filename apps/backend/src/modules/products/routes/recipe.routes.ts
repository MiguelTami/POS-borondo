import { RecipesController } from "../controllers/recipe.controller";
import { Router } from 'express'
import { validateParams } from "../../../shared/validations/middlewares/validateParams";
import { recipeIdParamSchema } from "../../../shared/validations/schemas/params.schemas";

const router = Router();
const controller = new RecipesController();

router.get('/', validateParams(recipeIdParamSchema), controller.getIngredientsRecipe) //products/:productId/recipes
router.post('/', controller.createIngredientRecipe) //products/:productId/recipes
router.patch('/:recipeId', validateParams(recipeIdParamSchema), controller.updateIngredientRecipe) //recipes/:recipeId
router.delete('/:recipeId', validateParams(recipeIdParamSchema), controller.deleteIngredientrecipe) //recipes/:recipeId

export default router
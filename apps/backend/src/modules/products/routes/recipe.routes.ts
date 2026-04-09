import { RecipesController } from "../controllers/recipe.controller";
import { Router } from 'express'
import { validate } from "../../../middlewares/validate.middleware";
import { recipeIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { updateRecipeSchema } from "../schemas/recipes.schema";
import { authorizeRole } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new RecipesController();

router.patch('/:recipeId', authorizeRole(['ADMIN']), validate(recipeIdParamSchema, 'params'), validate(updateRecipeSchema), controller.updateIngredientRecipe) //recipes/:recipeId
router.delete('/:recipeId', authorizeRole(['ADMIN']), validate(recipeIdParamSchema, 'params'), controller.deleteIngredientrecipe) //recipes/:recipeId

export default router
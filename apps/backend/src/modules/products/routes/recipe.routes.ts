import { RecipesController } from "../controllers/recipe.controller";
import { Router } from 'express'
import { validate } from "../../../middlewares/validate.middleware";
import { recipeIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { updateRecipeSchema } from "../schemas/recipes.schema";

const router = Router();
const controller = new RecipesController();

router.patch('/:recipeId', validate(recipeIdParamSchema, 'params'), validate(updateRecipeSchema), controller.updateIngredientRecipe) //recipes/:recipeId
router.delete('/:recipeId', validate(recipeIdParamSchema, 'params'), controller.deleteIngredientrecipe) //recipes/:recipeId

export default router
import { Router } from "express";
import { ProductsController } from "../controllers/product.controller";
import { RecipesController } from "../controllers/recipe.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";
import { productIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { recipeIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { getProductsQuerySchema } from "../schemas/product.query.schema";
import { createRecipeSchema } from "../schemas/recipes.schema";


const router = Router();
const controller = new ProductsController();
const recipeController = new RecipesController();

router.get('/', validate(getProductsQuerySchema, 'query'), controller.getProducts);
router.get('/:productId', validate(productIdParamSchema, 'params'), controller.getProductById);
router.post('/', validate(createProductSchema), controller.createProduct);
router.delete('/:productId', validate(productIdParamSchema, 'params'), controller.desactivateProduct);
router.patch('/:productId/reactivate', validate(productIdParamSchema, 'params'), controller.reactivateProduct);
router.patch('/:productId', validate(productIdParamSchema, 'params'), validate(updateProductSchema), controller.updateProduct);

router.get('/:productId/recipes', validate(productIdParamSchema, 'params'), recipeController.getIngredientsRecipe) //products/:productId/recipes
router.post('/:productId/recipes', validate(productIdParamSchema, 'params'), validate(createRecipeSchema), recipeController.createIngredientRecipe) //products/:productId/recipes

export default router;

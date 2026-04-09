import { Router } from "express";
import { ProductsController } from "../controllers/product.controller";
import { RecipesController } from "../controllers/recipe.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";
import { productIdParamSchema } from "../../../shared/validations/schemas/params.schema";
import { getProductsQuerySchema } from "../schemas/product.query.schema";
import { createRecipeSchema } from "../schemas/recipes.schema";
import { authenticate, authorizeRole } from "../../../middlewares/auth.middleware";


const router = Router();
const controller = new ProductsController();
const recipeController = new RecipesController();

router.get('/', authenticate, validate(getProductsQuerySchema, 'query'), controller.getProducts);
router.get('/:productId', authenticate, validate(productIdParamSchema, 'params'), controller.getProductById);
router.post('/', authenticate, authorizeRole(['ADMIN']), validate(createProductSchema), controller.createProduct);
router.delete('/:productId', authenticate, authorizeRole(['ADMIN']), validate(productIdParamSchema, 'params'), controller.desactivateProduct);
router.patch('/:productId/reactivate', authenticate, authorizeRole(['ADMIN']), validate(productIdParamSchema, 'params'), controller.reactivateProduct);
router.patch('/:productId', authenticate, authorizeRole(['ADMIN']), validate(productIdParamSchema, 'params'), validate(updateProductSchema), controller.updateProduct);

router.get('/:productId/recipes', authenticate, validate(productIdParamSchema, 'params'), recipeController.getIngredientsRecipe) //products/:productId/recipes
router.post('/:productId/recipes', authenticate, authorizeRole(['ADMIN']), validate(productIdParamSchema, 'params'), validate(createRecipeSchema), recipeController.createIngredientRecipe) //products/:productId/recipes

export default router;

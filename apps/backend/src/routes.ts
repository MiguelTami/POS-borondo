import { Router } from "express";
import productsRoutes from "./modules/products/routes/product.routes";
import ingredientRoutes from "./modules/products/routes/ingredient.routes";
import recipeRoutes from "./modules/products/routes/recipe.routes";
import categoryRoutes from "./modules/products/routes/category.routes";

const router = Router();

router.use("/products", productsRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/recipes", recipeRoutes);
router.use("/categories", categoryRoutes);

export default router;

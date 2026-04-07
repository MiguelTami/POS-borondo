import { Router } from "express";
import productsRoutes from "./modules/products/routes/product.routes";
import ingredientRoutes from "./modules/products/routes/ingredient.routes";
import recipeRoutes from "./modules/products/routes/recipe.routes";
import categoryRoutes from "./modules/products/routes/category.routes";
import tableRoutes from "./modules/tables/routes/table.routes";
import orderRoutes from "./modules/orders/routes/order.routes";
import paymentRoutes from "./modules/payments/routes/payment.routes";
import userRoutes from "./modules/users/routes/user.routes";

const router = Router();

router.use("/products", productsRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/tables", tableRoutes);
router.use("/recipes", recipeRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes)
router.use("/payments", paymentRoutes)
router.use("/users", userRoutes);

export default router;

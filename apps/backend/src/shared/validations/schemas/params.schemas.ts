import Joi = require("joi");

/*
Reusable building block
*/
const numberId = Joi.number()
  .integer()
  .positive()
  .required();


/*
Product endpoints
*/
export const productIdParamSchema = Joi.object({
  productId: numberId
});


/*
Recipe endpoints
*/
export const recipeIdParamSchema = Joi.object({
  recipeId: numberId
});


export const productRecipeParamsSchema = Joi.object({
  productId: numberId,
  recipeId: numberId
});


/*
Ingredient endpoints
*/
export const ingredientIdParamSchema = Joi.object({
  ingredientId: numberId
});


/*
Category endpoints
*/
export const categoryIdParamSchema = Joi.object({
  categoryId: numberId
});
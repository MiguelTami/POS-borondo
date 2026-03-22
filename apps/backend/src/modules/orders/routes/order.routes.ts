import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { createOrderSchema } from "../schemas/order.schema";

const router = Router();
const orderController = new OrderController();



export default router
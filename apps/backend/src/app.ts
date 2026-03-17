import express from "express";
import routes from "./routes";

const app = express();

// Middlewares globales
app.use(express.json());

// Prefijo global de API
app.use("/api", routes);

export default app;
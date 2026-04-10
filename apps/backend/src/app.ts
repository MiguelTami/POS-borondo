import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// Middlewares globales
app.use(express.json());

// Prefijo global de API
app.use("/api", routes);

export default app;
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { config } from "./config.js";
import {errorHandler} from "./middlewares/errorHandler.js";


const app = express();

app.use(helmet());
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}))
app.use(express.json());
if (!config.isProduction && process.env.NODE_ENV !== 'test') app.use(morgan('dev'))
app.use(cookieParser());
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() })
});
app.use("/api",authRoutes, taskRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});
app.use(errorHandler);

export default app;
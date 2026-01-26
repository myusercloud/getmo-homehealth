import express from "express";
import cors from "cors";
import { router as equipmentRoutes } from "./routes/equipment.routes.js";
import authRoutes from "./routes/auth.routes.js";
import morgan from "morgan";

console.log("Equipment routes loaded!");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to the Getmo Backend (web)");
});

app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);



export default app;

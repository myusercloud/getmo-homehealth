import express from "express";
import cors from "cors";
import equipmentRoutes from "./routes/equipment.routes.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Getmo Backend (web)");
});

app.use("/api/equipment", equipmentRoutes);

export default app;

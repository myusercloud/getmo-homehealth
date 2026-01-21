import express from "express";
import cors from "cors";
import equipmentRoutes from "./routes/equipment.js";
import orderRoutes from "./routes/orders.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Getmo Backend (web)");
});


app.use("/equipment", equipmentRoutes);
app.use("/orders", orderRoutes);

export default app;

import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

// CREATE ORDER
router.post("/", async (req, res) => {
  const { client_id, equipment_id, quantity } = req.body;
  try {
    const order = await prisma.order.create({
      data: { client_id, equipment_id, quantity },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { equipment: true },
  });
  res.json(orders);
});

// GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { equipment: true },
  });
  res.json(order);
});

export default router;

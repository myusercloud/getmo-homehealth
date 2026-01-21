import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

// CREATE ORDER
router.post("/", async (req, res) => {
  const { client_id, equipment_id, quantity } = req.body;

  try {
    // 1. Fetch equipment to get price
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipment_id },
    });

    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    // 2. Calculate total
    const total = quantity * equipment.price;

    // 3. Create order with calculated total
    const order = await prisma.order.create({
      data: {
        client_id,
        equipment_id,
        quantity,
        total,
      },
    });

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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

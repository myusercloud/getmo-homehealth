import express from "express";
import { prisma } from "../prisma.js";
import { auth, adminOnly } from "../middleware/auth.js";


const router = express.Router();

// CREATE
router.post("/", auth, adminOnly, async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;
  try {
    const item = await prisma.equipment.create({
      data: { name, description, price, stock, image_url },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// READ ALL
router.get("/",  async (req, res) => {
  const items = await prisma.equipment.findMany();
  res.json(items);
});

// READ ONE
router.get("/:id", async (req, res) => {
  const item = await prisma.equipment.findUnique({
    where: { id: req.params.id },
  });
  res.json(item);
});

// UPDATE
router.put("/:id", auth, adminOnly, async (req, res) => {
  const data = req.body;
  const item = await prisma.equipment.update({
    where: { id: req.params.id },
    data,
  });
  res.json(item);
});

// DELETE
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await prisma.equipment.delete({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
});

export default router;

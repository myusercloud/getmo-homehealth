import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Hardcoded admin (optional: move to env)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ADMIN LOGIN ONLY
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

export default router;
